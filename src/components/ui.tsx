import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Badge({
  children,
  color = 'slate',
}: {
  children: React.ReactNode;
  color?: 'slate' | 'brand' | 'accent' | 'blue' | 'red' | 'violet' | 'amber';
}) {
  const colors = {
    slate: 'bg-slate-100 text-slate-600',
    brand: 'bg-brand-50 text-brand-700',
    accent: 'bg-accent-50 text-accent-700',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return <span className={`badge ${colors[color]}`}>{children}</span>;
}

export function statusBadge(status: string) {
  const map: Record<string, 'brand' | 'accent' | 'blue' | 'red' | 'slate' | 'amber' | 'violet'> = {
    upcoming: 'blue',
    completed: 'brand',
    cancelled: 'red',
    pending: 'amber',
    accepted: 'brand',
    declined: 'red',
    active: 'brand',
    inactive: 'slate',
    paid: 'brand',
    processing: 'amber',
    refunded: 'red',
    published: 'brand',
    flagged: 'red',
  };
  return map[status] || 'slate';
}
