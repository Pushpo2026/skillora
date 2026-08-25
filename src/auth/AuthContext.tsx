import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Role, User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'avatar'>>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'skillora.auth.user';
const USERS_KEY = 'skillora.auth.users';

const av = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

interface StoredUser extends User {
  password: string;
}

const demoUsers: StoredUser[] = [
  { id: 'u-stu-1', name: 'Alex Morgan', email: 'student@skillora.com', role: 'student', avatar: av('Alex Morgan'), password: 'demo1234' },
  { id: 'u-tut-1', name: 'Dr. Sarah Chen', email: 'tutor@skillora.com', role: 'tutor', avatar: av('Dr. Sarah Chen'), password: 'demo1234' },
  { id: 'u-adm-1', name: 'Admin User', email: 'admin@skillora.com', role: 'admin', avatar: av('Admin User'), password: 'demo1234' },
];

function seedUsers(): StoredUser[] {
  try {
    const existing = localStorage.getItem(USERS_KEY);
    if (existing) return JSON.parse(existing);
  } catch {
    // ignore
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  return demoUsers;
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function stripPassword(u: StoredUser): User {
  const { password: _pw, ...rest } = u;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  useEffect(() => {
    seedUsers();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        setState({ user, loading: false, error: null });
        return;
      }
    } catch {
      // ignore
    }
    setState({ user: null, loading: false, error: null });
  }, []);

  const login = useCallback(async (email: string, password: string, role: Role) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    await new Promise((r) => setTimeout(r, 400));

    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!found) {
      setState((s) => ({ ...s, loading: false, error: 'Invalid email or password.' }));
      throw new Error('Invalid credentials');
    }
    if (found.role !== role) {
      setState((s) => ({ ...s, loading: false, error: `This account is registered as a ${found.role}. Please select the correct role.` }));
      throw new Error('Role mismatch');
    }

    const user = stripPassword(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, loading: false, error: null });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: Role) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    await new Promise((r) => setTimeout(r, 500));

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setState((s) => ({ ...s, loading: false, error: 'An account with this email already exists.' }));
      throw new Error('Email already registered');
    }

    const newUser: StoredUser = {
      id: `u-${role}-${Date.now()}`,
      name,
      email,
      role,
      avatar: av(name),
      password,
    };
    const updated = [...users, newUser];
    saveUsers(updated);

    const user = stripPassword(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, loading: false, error: null });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, loading: false, error: null });
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'avatar'>>) => {
    setState((s) => {
      if (!s.user) return s;
      const user = { ...s.user, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates };
        saveUsers(users);
      }
      return { ...s, user };
    });
  }, []);

  const clearError = useCallback(() => setState((s) => ({ ...s, error: null })), []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function roleHome(role: Role): string {
  return `/${role}/dashboard`;
}
