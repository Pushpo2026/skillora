import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader, Badge } from '@/components/ui';
import { platformStats, weeklyRevenue, subjectDistribution, tutors } from '@/data/mock';
import { Users, GraduationCap, Star, TrendingUp, Download, Calendar, DollarSign, Activity } from 'lucide-react';

export function AdminReports() {
  const maxRev = Math.max(...weeklyRevenue.map((w) => w.value));
  const topTutors = [...tutors].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5);

  return (
    <DashboardShell role="admin">
      <PageHeader title="Reports & Statistics" subtitle="Platform performance analytics and insights." action={<button className="btn-secondary"><Download className="w-4 h-4" /> Export report</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Activity} label="Completion rate" value={`${platformStats.completionRate}%`} accent="brand" />
        <StatCard icon={Star} label="Average rating" value={platformStats.avgRating.toString()} accent="accent" />
        <StatCard icon={Calendar} label="Active sessions" value={String(platformStats.activeSessions)} accent="blue" />
        <StatCard icon={TrendingUp} label="Monthly growth" value={`${platformStats.monthlyGrowth}%`} accent="violet" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue trend */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-6">Revenue trend (this week)</h2>
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyRevenue.map((w) => (
              <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-400 to-brand-600 transition-all duration-500" style={{ height: `${(w.value / maxRev) * 100}%` }} />
                <span className="text-xs text-slate-500">{w.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
            <span className="text-slate-500">Total this week</span>
            <span className="font-bold text-slate-900">${weeklyRevenue.reduce((s, w) => s + w.value, 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Subject distribution */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Bookings by subject</h2>
          <div className="space-y-3">
            {subjectDistribution.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{s.subject}</span><span className="font-medium text-slate-900">{s.percent}%</span></div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500" style={{ width: `${s.percent * 3}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top tutors */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Top performing tutors</h2>
          <div className="space-y-3">
            {topTutors.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.reviewsCount} reviews · {t.totalSessions} sessions</p>
                </div>
                <Badge color="accent">{t.rating}★</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Key performance indicators</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50">
              <Users className="w-5 h-5 text-brand-600 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{platformStats.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total students</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <GraduationCap className="w-5 h-5 text-brand-600 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{platformStats.totalTutors}</p>
              <p className="text-xs text-slate-500">Total tutors</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <Calendar className="w-5 h-5 text-brand-600 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{platformStats.totalBookings.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total bookings</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <DollarSign className="w-5 h-5 text-brand-600 mb-2" />
              <p className="text-2xl font-bold text-slate-900">${(platformStats.totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500">Total revenue</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
