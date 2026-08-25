import { useState } from 'react';
import { Link, useHashRoute } from '@/router';
import type { Role } from '@/types';
import { useAuth } from '@/auth/AuthContext';
import {
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  Bell,
  Star,
  User,
  Sparkles,
  BookOpen,
  Users,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ClipboardList,
  DollarSign,
  Clock,
  GraduationCap,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const navConfig: Record<Role, { group: string; items: { to: string; label: string; icon: typeof LayoutDashboard }[] }[]> = {
  student: [
    {
      group: 'Main',
      items: [
        { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/tutors', label: 'Find Tutors', icon: Search },
        { to: '/ai-recommend', label: 'AI Recommendation', icon: Sparkles },
        { to: '/student/bookings', label: 'My Bookings', icon: Calendar },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/student/messages', label: 'Messages', icon: MessageSquare },
        { to: '/student/notifications', label: 'Notifications', icon: Bell },
        { to: '/student/reviews', label: 'My Reviews', icon: Star },
        { to: '/student/profile', label: 'Profile', icon: User },
      ],
    },
  ],
  tutor: [
    {
      group: 'Main',
      items: [
        { to: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/tutor/profile', label: 'My Profile', icon: User },
        { to: '/tutor/availability', label: 'Availability', icon: Clock },
        { to: '/tutor/requests', label: 'Booking Requests', icon: ClipboardList },
        { to: '/tutor/students', label: 'My Students', icon: Users },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/tutor/messages', label: 'Messages', icon: MessageSquare },
        { to: '/tutor/earnings', label: 'Earnings', icon: DollarSign },
        { to: '/tutor/reviews', label: 'Reviews', icon: Star },
      ],
    },
  ],
  admin: [
    {
      group: 'Overview',
      items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      group: 'Management',
      items: [
        { to: '/admin/students', label: 'Students', icon: Users },
        { to: '/admin/tutors', label: 'Tutors', icon: GraduationCap },
        { to: '/admin/verification', label: 'Verification', icon: ShieldCheck },
        { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
        { to: '/admin/payments', label: 'Payments', icon: CreditCard },
        { to: '/admin/reviews', label: 'Reviews', icon: Star },
        { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
      ],
    },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const { path, navigate } = useHashRoute();
  const { user: authUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = authUser ?? { id: '', name: 'Guest', email: '', role, avatar: '' };
  const groups = navConfig[role];

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold font-display text-slate-900">Skillora</span>
        </Link>
        <div className="mt-4 flex items-center gap-3 px-2">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-100" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{role} account</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = path === item.to || (path.startsWith(item.to) && item.to !== '/');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        <button
          onClick={() => { logout(); setMobileOpen(false); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-card border border-slate-200"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in">
            <button className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100" onClick={() => setMobileOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            {content}
          </div>
        </div>
      )}

      <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-200 bg-white sticky top-0 h-screen flex-col">
        {content}
      </aside>
    </>
  );
}

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role={role} />
      <div className="flex-1 min-w-0">
        <div className="lg:pl-0">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pt-16 lg:pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
