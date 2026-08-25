import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader, Badge, statusBadge } from '@/components/ui';
import { Link } from '@/router';
import { useAuth } from '@/auth/AuthContext';
import { useBookings } from '@/booking/BookingContext';
import { useNotifications } from '@/notifications/NotificationContext';
import { useReviews } from '@/review/ReviewContext';
import { tutors, notifications as mockNotifications } from '@/data/mock';
import { Calendar, Clock, BookOpen, TrendingUp, Sparkles, ArrowRight, Video, Star, Bell } from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const { notifications } = useNotifications();
  const { reviews } = useReviews();
  const upcoming = bookings.filter((b) => b.status === 'upcoming');
  const completed = bookings.filter((b) => b.status === 'completed');
  const recommended = tutors.filter((t) => t.topRated).slice(0, 3);
  const recentNotifs = notifications.length > 0 ? notifications.slice(0, 4) : mockNotifications.slice(0, 4);
  const myReviews = reviews.filter((r) => r.studentName === user?.name).slice(0, 2);
  const hoursLearned = completed.reduce((sum, b) => sum + b.duration / 60, 0).toFixed(1);

  return (
    <DashboardShell role="student">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'Student'}`}
        subtitle="Here's what's happening with your learning."
        action={<Link to="/tutors" className="btn-primary"><Sparkles className="w-4 h-4" /> Find a tutor</Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Upcoming sessions" value={String(upcoming.length)} accent="brand" />
        <StatCard icon={BookOpen} label="Completed sessions" value={String(completed.length)} accent="blue" />
        <StatCard icon={Clock} label="Hours learned" value={hoursLearned} accent="accent" />
        <StatCard icon={TrendingUp} label="Avg. progress" value="+18%" trend={{ value: 'this month', up: true }} accent="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming sessions */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Upcoming sessions</h2>
            <Link to="/student/bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <img src={b.tutorAvatar} alt={b.tutorName} className="w-12 h-12 rounded-full bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{b.subject}</p>
                  <p className="text-sm text-slate-500">with {b.tutorName}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-slate-900">{b.date}</p>
                  <p className="text-slate-500">{b.time} · {b.duration}min</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-brand-600 text-xs font-medium bg-brand-50 px-2.5 py-1.5 rounded-lg">
                  <Video className="w-3.5 h-3.5" /> Join
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <Link to="/student/notifications" className="text-sm text-brand-600 hover:text-brand-700 font-medium">All</Link>
          </div>
          <div className="space-y-3">
            {recentNotifs.map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-100' : 'bg-brand-50'}`}>
                  <Bell className={`w-4 h-4 ${n.read ? 'text-slate-400' : 'text-brand-600'}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm ${n.read ? 'text-slate-500' : 'font-medium text-slate-900'}`}>{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" /> Recommended for you
          </h2>
          <Link to="/ai-recommend" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Get AI match <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {recommended.map((t) => (
            <Link key={t.id} to={`/tutors/${t.id}`} className="card p-4 hover:shadow-card-hover transition-all group">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate group-hover:text-brand-700">{t.name}</p>
                  <p className="text-xs text-slate-500 truncate">{t.subjects[0]}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-accent-400 fill-accent-400" />
                    <span className="text-xs font-medium">{t.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Your recent reviews</h2>
          <Link to="/student/reviews" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
        </div>
        <div className="space-y-4">
          {myReviews.map((r) => (
            <div key={r.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <img src={r.studentAvatar} alt={r.studentName} className="w-10 h-10 rounded-full bg-slate-100" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{r.subject}</p>
                  <Badge color={statusBadge('completed')}>completed</Badge>
                </div>
                <p className="text-sm text-slate-600 mt-1">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
