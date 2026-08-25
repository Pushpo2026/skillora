import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { NotificationItem } from '@/types';
import { notifications as seedNotifications } from '@/data/mock';

interface NotificationContextValue {
  notifications: NotificationItem[];
  addNotification: (n: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  markAllRead: () => void;
  toggleRead: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);
const STORAGE_KEY = 'skillora.notifications';

function seed(): NotificationItem[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotifications));
  return seedNotifications;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setNotifications(seed());
  }, []);

  const persist = useCallback((next: NotificationItem[]) => {
    setNotifications(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addNotification = useCallback(
    (n: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
      setNotifications((prev) => {
        const item: NotificationItem = {
          ...n,
          id: `n-${Date.now()}`,
          time: 'Just now',
          read: false,
        };
        const next = [item, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAllRead, toggleRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
