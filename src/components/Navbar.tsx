import { useState } from 'react';
import { Link, useHashRoute } from '@/router';
import { useAuth, roleHome } from '@/auth/AuthContext';
import { useNotifications } from '@/notifications/NotificationContext';
import { GraduationCap, Menu, X, Bell, Search, LogOut, User } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { navigate } = useHashRoute();
  const { unreadCount } = useNotifications();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/tutors', label: 'Find Tutors' },
    { to: '/ai-recommend', label: 'AI Match' },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-slate-900">Skillora</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700 rounded-lg hover:bg-slate-50 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/tutors" className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                  <Search className="w-5 h-5" />
                </Link>
                <Link to={user.role === 'student' ? '/student/notifications' : `/${user.role}/dashboard`} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-slate-100"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-100" />
                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user.name}</span>
                  </button>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 card p-2 z-20 animate-fade-in">
                        <Link to={roleHome(user.role)} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
                          <User className="w-4 h-4" /> Dashboard
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Sign in</Link>
                <Link to="/register" className="btn-primary">Get started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {publicLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to={roleHome(user.role)} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Sign out
              </button>
            </>
          ) : (
            <div className="pt-2 flex gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Get started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
