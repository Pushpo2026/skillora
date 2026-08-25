import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, statusBadge, EmptyState } from '@/components/ui';
import { useState } from 'react';
import { Link } from '@/router';
import { useBookings } from '@/booking/BookingContext';
import { useToast } from '@/components/Toast';
import { Calendar, Video, MapPin, Clock, CalendarX, Search } from 'lucide-react';

export function StudentBookings() {
  const { bookings, cancelBooking } = useBookings();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const handleCancel = (id: string, tutorName: string) => {
    cancelBooking(id);
    toast(`Session with ${tutorName} cancelled.`, 'info');
  };

  return (
    <DashboardShell role="student">
      <PageHeader title="My Bookings" subtitle="Manage your tutoring sessions." />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f} {f !== 'all' && `(${bookings.filter((b) => b.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img src={b.tutorAvatar} alt={b.tutorName} className="w-14 h-14 rounded-full bg-slate-100" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{b.subject}</h3>
                    <Badge color={statusBadge(b.status)}>{b.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">with {b.tutorName}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {b.time} ({b.duration}min)</span>
                    <span className="flex items-center gap-1.5">{b.mode === 'video' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />} {b.mode}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                  <span className="text-lg font-bold text-slate-900">${b.price.toFixed(2)}</span>
                  {b.status === 'upcoming' && (
                    <div className="flex gap-2">
                      <button className="btn-primary text-xs px-3 py-1.5">Join</button>
                      <button onClick={() => handleCancel(b.id, b.tutorName)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                    </div>
                  )}
                  {b.status === 'completed' && (
                    <Link to="/student/reviews" className="btn-secondary text-xs px-3 py-1.5">Leave review</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarX}
          title="No bookings here"
          description="You don't have any bookings in this category yet."
          action={<Link to="/tutors" className="btn-primary"><Search className="w-4 h-4" /> Find a tutor</Link>}
        />
      )}
    </DashboardShell>
  );
}
