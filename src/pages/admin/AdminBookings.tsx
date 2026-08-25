import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, statusBadge, EmptyState } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { useBookings } from '@/booking/BookingContext';
import { useToast } from '@/components/Toast';
import { Search, Video, MapPin, Calendar, Clock, CalendarX, AlertTriangle } from 'lucide-react';

export function AdminBookings() {
  const { bookings, updateBookingStatus } = useBookings();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'pending' | 'cancelled'>('all');
  const [cancelTarget, setCancelTarget] = useState<{ id: string; subject: string; student: string } | null>(null);

  const filtered = bookings.filter((b) => {
    const matchQuery =
      b.subject.toLowerCase().includes(query.toLowerCase()) ||
      b.studentName.toLowerCase().includes(query.toLowerCase()) ||
      b.tutorName.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchQuery && matchFilter;
  });

  const handleCancel = () => {
    if (!cancelTarget) return;
    updateBookingStatus(cancelTarget.id, 'cancelled');
    toast(`Booking "${cancelTarget.subject}" for ${cancelTarget.student} cancelled.`, 'info');
    setCancelTarget(null);
  };

  return (
    <DashboardShell role="admin">
      <PageHeader title="Manage Bookings" subtitle={`${bookings.length} bookings on the platform.`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-9" placeholder="Search by subject, student, or tutor..." />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'completed' | 'pending' | 'cancelled')}
          className="input sm:w-44"
        >
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Session</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Tutor</th>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{b.subject}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {b.mode === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} {b.mode}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{b.studentName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={b.tutorAvatar} alt={b.tutorName} className="w-7 h-7 rounded-full bg-slate-100" />
                        <span className="text-slate-700">{b.tutorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3" /> {b.time} ({b.duration}min)</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">${b.price.toFixed(2)}</td>
                    <td className="px-4 py-3"><Badge color={statusBadge(b.status)}>{b.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      {(b.status === 'upcoming' || b.status === 'pending') && (
                        <button
                          onClick={() => setCancelTarget({ id: b.id, subject: b.subject, student: b.studentName })}
                          className="btn-secondary text-xs px-3 py-1.5 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={CalendarX} title="No bookings found" description="There are no bookings matching your search or filter." />
      )}

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel booking?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-slate-600">
              Cancel the booking <span className="font-medium text-slate-900">"{cancelTarget?.subject}"</span> for{' '}
              <span className="font-medium text-slate-900">{cancelTarget?.student}</span>? The student and tutor will be notified.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setCancelTarget(null)} className="btn-secondary">Keep booking</button>
            <button onClick={handleCancel} className="btn-danger">Cancel booking</button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
