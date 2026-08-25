import type { LucideIcon } from 'lucide-react';

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  accent = 'brand',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: { value: string; up: boolean };
  accent?: 'brand' | 'accent' | 'blue' | 'violet';
}) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend.up ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
