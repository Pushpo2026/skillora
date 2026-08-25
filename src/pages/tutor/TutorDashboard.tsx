import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader, Badge, statusBadge } from '@/components/ui';
import { Link } from '@/router';
import { tutorBookingRequests, earnings, reviews, tutorStudents } from '@/data/mock';
import { Calendar, DollarSign, Users, Star, TrendingUp, ArrowRight, Clock, ClipboardList } from 'lucide-react';

export function TutorDashboard() {
  const pending = tutorBookingRequests.filter((r) => r.status === 'pending');
  const monthEarnings = earnings.reduce((s, e) => s + (e.status === 'paid' ? e.amount : 0), 0);
  const activeStudents = tutorStudents.filter((s) => s.status === 'active').length;

  return (
    <DashboardShell role="tutor">
      <PageHeader
        title="Welcome, Dr. Chen"
        subtitle="Here's your tutoring overview for today."
        action={<Link to="/tutor/availability" className="btn-primary"><Calendar className="w-4 h-4" /> Manage availability</Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="This month's earnings" value={`$${monthEarnings.toFixed(0)}`} trend={{ value: '12%', up: true }} accent="brand" />
        <StatCard icon={Calendar} label="Upcoming sessions" value="8" accent="blue" />
        <StatCard icon={Users} label="Active students" value={String(activeStudents)} accent="violet" />
        <StatCard icon={Star} label="Average rating" value="4.9" accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking requests */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-brand-600" /> Pending booking requests</h2>
            <Link to="/tutor/requests" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-slate-100">
                <img src={r.studentAvatar} alt={r.studentName} className="w-12 h-12 rounded-full bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{r.subject}</p>
                  <p className="text-sm text-slate-500">{r.studentName} · {r.date} at {r.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary text-xs px-3 py-1.5">Accept</button>
                  <button className="btn-secondary text-xs px-3 py-1.5">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">This week</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Sessions</span>
              <span className="font-semibold text-slate-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Hours taught</span>
              <span className="font-semibold text-slate-900">14.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">New students</span>
              <span className="font-semibold text-slate-900">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Response rate</span>
              <span className="font-semibold text-brand-600">98%</span>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              Earnings up 12% from last month
            </div>
          </div>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Recent reviews</h2>
          <Link to="/tutor/reviews" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.slice(0, 2).map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <img src={r.authorAvatar} alt={r.author} className="w-9 h-9 rounded-full bg-slate-100" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.author}</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => <Star key={i} className={`w-3 h-3 ${i <= r.rating ? 'text-accent-400 fill-accent-400' : 'text-slate-300'}`} />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
