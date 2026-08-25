import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader } from '@/components/ui';
import { useNotifications } from '@/notifications/NotificationContext';
import { Bell, Calendar, MessageSquare, Star, CreditCard, Settings, Check } from 'lucide-react';

const iconMap = {
  booking: Calendar,
  message: MessageSquare,
  review: Star,
  payment: CreditCard,
  system: Settings,
};

const colorMap = {
  booking: 'bg-blue-50 text-blue-600',
  message: 'bg-brand-50 text-brand-600',
  review: 'bg-accent-50 text-accent-600',
  payment: 'bg-violet-50 text-violet-600',
  system: 'bg-slate-100 text-slate-600',
};

export function StudentNotifications() {
  const { notifications, markAllRead, toggleRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const shown = filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <DashboardShell role="student">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`}
        action={unreadCount > 0 ? <button onClick={markAllRead} className="btn-secondary">Mark all as read</button> : undefined}
      />

      <div className="flex gap-2 mb-4">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f === 'all' ? 'All' : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {shown.length > 0 ? (
          shown.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <button
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={`w-full card p-4 flex items-start gap-4 text-left transition-all hover:shadow-card-hover ${!n.read ? 'border-l-4 border-l-brand-500' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[n.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${n.read ? 'font-medium text-slate-700' : 'font-semibold text-slate-900'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
                {n.read && <Check className="w-4 h-4 text-slate-300 shrink-0 mt-1" />}
              </button>
            );
          })
        ) : (
          <div className="card p-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">All caught up</h3>
            <p className="text-sm text-slate-500 mt-1">You have no unread notifications.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
