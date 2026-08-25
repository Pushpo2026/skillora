import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, statusBadge, EmptyState } from '@/components/ui';
import { tutorBookingRequests } from '@/data/mock';
import { Check, X, Clock, Calendar, Video } from 'lucide-react';
import { useToast } from '@/components/Toast';

export function TutorRequests() {
  const [requests, setRequests] = useState(tutorBookingRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const { toast } = useToast();
  const shown = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const act = (id: string, status: 'accepted' | 'declined') =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <DashboardShell role="tutor">
      <PageHeader title="Booking Requests" subtitle="Review and respond to student booking requests." />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'pending', 'accepted', 'declined'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f} {f !== 'all' && `(${requests.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <img src={r.studentAvatar} alt={r.studentName} className="w-14 h-14 rounded-full bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{r.subject}</h3>
                      <Badge color={statusBadge(r.status)}>{r.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{r.studentName}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {r.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {r.time} ({r.duration}min)</span>
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Video</span>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm text-slate-600">
                      "{r.message}"
                    </div>
                  </div>
                </div>
                <div className="lg:w-40 flex flex-row lg:flex-col justify-between lg:justify-start gap-2 lg:items-end">
                  <span className="text-2xl font-bold text-slate-900">${r.price}</span>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => act(r.id, 'accepted')} className="btn-primary text-sm"><Check className="w-4 h-4" /> Accept</button>
                      <button onClick={() => act(r.id, 'declined')} className="btn-secondary text-sm"><X className="w-4 h-4" /> Decline</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Clock} title="No requests" description="You don't have any requests in this category." />
      )}
    </DashboardShell>
  );
}
