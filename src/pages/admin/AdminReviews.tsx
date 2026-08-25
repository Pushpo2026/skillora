import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, statusBadge, EmptyState } from '@/components/ui';
import { Rating } from '@/components/Rating';
import { Modal } from '@/components/Modal';
import { useReviews } from '@/review/ReviewContext';
import { useToast } from '@/components/Toast';
import { Check, X, Flag, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';

export function AdminReviews() {
  const { reviews, updateReviewStatus, removeReview } = useReviews();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'flagged'>('all');
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'unflag' | 'remove'; id: string; label: string } | null>(null);

  const shown = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { type, id, label } = confirmAction;
    if (type === 'approve') {
      updateReviewStatus(id, 'published');
      toast(`Review by ${label} approved.`, 'success');
    } else if (type === 'unflag') {
      updateReviewStatus(id, 'pending');
      toast(`Review by ${label} unflagged.`, 'info');
    } else if (type === 'remove') {
      removeReview(id);
      toast(`Review by ${label} removed.`, 'error');
    }
    setConfirmAction(null);
  };

  return (
    <DashboardShell role="admin">
      <PageHeader title="Manage Reviews" subtitle={`${reviews.length} reviews across the platform.`} />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'published', 'pending', 'flagged'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f} {f !== 'all' && `(${reviews.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Rating value={r.rating} />
                    <Badge color={statusBadge(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{r.comment}</p>
                  <div className="mt-2 text-xs text-slate-400">
                    {r.studentName} → {r.tutorName} · {r.date}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                  {r.status !== 'published' && (
                    <button
                      onClick={() => setConfirmAction({ type: 'approve', id: r.id, label: r.studentName })}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {r.status === 'flagged' && (
                    <button
                      onClick={() => setConfirmAction({ type: 'unflag', id: r.id, label: r.studentName })}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      <Flag className="w-3.5 h-3.5" /> Unflag
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmAction({ type: 'remove', id: r.id, label: r.studentName })}
                    className="btn-secondary text-xs px-3 py-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={MessageSquare} title="No reviews found" description="There are no reviews matching this filter." />
      )}

      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.type === 'remove' ? 'Remove review?' : confirmAction?.type === 'approve' ? 'Approve review?' : 'Unflag review?'}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${confirmAction?.type === 'remove' ? 'bg-red-100' : 'bg-brand-100'}`}>
              {confirmAction?.type === 'remove' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <Check className="w-5 h-5 text-brand-600" />}
            </div>
            <p className="text-sm text-slate-600">
              {confirmAction?.type === 'remove'
                ? `Are you sure you want to remove the review by ${confirmAction.label}? This action cannot be undone.`
                : confirmAction?.type === 'approve'
                  ? `Approve the review by ${confirmAction.label}? It will be visible on the platform.`
                  : `Unflag the review by ${confirmAction.label}? It will return to pending status.`}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirmAction(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={handleConfirm}
              className={confirmAction?.type === 'remove' ? 'btn-danger' : 'btn-primary'}
            >
              {confirmAction?.type === 'remove' ? <Trash2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {confirmAction?.type === 'remove' ? 'Remove' : confirmAction?.type === 'approve' ? 'Approve' : 'Unflag'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
