import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader, Badge, statusBadge } from '@/components/ui';
import { Link } from '@/router';
import { platformStats, weeklyRevenue, subjectDistribution, adminBookings, pendingTutors, recentActivities } from '@/data/mock';
import { useBookings } from '@/booking/BookingContext';
import { usePayments } from '@/payment/PaymentContext';
import { useReviews } from '@/review/ReviewContext';
import { Users, GraduationCap, Calendar, DollarSign, ShieldCheck, ArrowRight, TrendingUp, AlertCircle, Activity, CreditCard, Star, UserPlus, CheckCircle2 } from 'lucide-react';

export function AdminDashboard() {
  const maxRev = Math.max(...weeklyRevenue.map((w) => w.value));
  const { bookings } = useBookings();
  const { payments } = usePayments();
  const { reviews } = useReviews();

  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const totalRevenue = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pendingVerifications = pendingTutors.length;

  const activityIcons = {
    booking: Calendar,
    payment: CreditCard,
    review: Star,
    verification: ShieldCheck,
    registration: UserPlus,
  };

  const activityColors = {
    booking: 'bg-blue-50 text-blue-600',
    payment: 'bg-brand-50 text-brand-600',
    review: 'bg-accent-50 text-accent-600',
    verification: 'bg-violet-50 text-violet-600',
    registration: 'bg-slate-100 text-slate-600',
  };

  return (
    <DashboardShell role="admin">
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and key metrics." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total students" value={platformStats.totalStudents.toLocaleString()} trend={{ value: '8%', up: true }} accent="brand" />
        <StatCard icon={GraduationCap} label="Total tutors" value={String(platformStats.totalTutors)} trend={{ value: '5%', up: true }} accent="blue" />
        <StatCard icon={Calendar} label="Total bookings" value={String(bookings.length)} trend={{ value: '12%', up: true }} accent="violet" />
        <StatCard icon={DollarSign} label="Revenue" value={`${totalRevenue.toFixed(0)}`} trend={{ value: '18%', up: true }} accent="accent" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CheckCircle2} label="Completed bookings" value={String(completedBookings)} accent="brand" />
        <StatCard icon={ShieldCheck} label="Pending verifications" value={String(pendingVerifications)} accent="accent" />
        <StatCard icon={Star} label="Total reviews" value={String(reviews.length)} accent="blue" />
        <StatCard icon={Activity} label="Active sessions" value={String(platformStats.activeSessions)} accent="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-900">Weekly revenue</h2>
            <Badge color="brand">+{platformStats.monthlyGrowth}%</Badge>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyRevenue.map((w) => (
              <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-brand-100 rounded-t-lg relative group" style={{ height: `${(w.value / maxRev) * 100}%` }}>
                  <div className="w-full bg-brand-500 rounded-t-lg absolute bottom-0 transition-all duration-500" style={{ height: '100%' }} />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">${(w.value / 1000).toFixed(1)}k</span>
                </div>
                <span className="text-xs text-slate-500">{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-accent-500" /> Action needed</h2>
          <div className="space-y-3">
            <Link to="/admin/verification" className="flex items-center justify-between p-3 rounded-lg bg-accent-50 hover:bg-accent-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-900">Tutor verifications</p>
                <p className="text-xs text-slate-500">{platformStats.pendingVerifications} pending</p>
              </div>
              <ArrowRight className="w-4 h-4 text-accent-600" />
            </Link>
            <Link to="/admin/payments" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-900">Pending payments</p>
                <p className="text-xs text-slate-500">{platformStats.pendingPayments} to process</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link to="/admin/reviews" className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-900">Flagged reviews</p>
                <p className="text-xs text-slate-500">{platformStats.flaggedReviews} to review</p>
              </div>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject distribution */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Subject distribution</h2>
          <div className="space-y-3">
            {subjectDistribution.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{s.subject}</span><span className="font-medium text-slate-900">{s.percent}%</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-brand-500 rounded-full" style={{ width: `${s.percent * 3}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {adminBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center gap-3 text-sm">
                <img src={b.tutorAvatar} alt={b.tutorName} className="w-9 h-9 rounded-full bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{b.subject}</p>
                  <p className="text-xs text-slate-500">{b.student} → {b.tutorName}</p>
                </div>
                <Badge color={statusBadge(b.status)}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending tutors */}
      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand-600" /> Pending tutor verifications</h2>
          <Link to="/admin/verification" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {pendingTutors.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{t.name}</p>
                <p className="text-xs text-slate-500">{t.title}</p>
              </div>
              <Link to="/admin/verification" className="btn-primary text-xs px-3 py-1.5">Review</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="mt-8 card p-6">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-brand-600" /> Recent activity</h2>
        <div className="space-y-3">
          {recentActivities.map((a) => {
            const Icon = activityIcons[a.type];
            return (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activityColors[a.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{a.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
