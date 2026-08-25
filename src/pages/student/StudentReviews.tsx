import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, EmptyState } from '@/components/ui';
import { Rating } from '@/components/Rating';
import { Modal } from '@/components/Modal';
import { useReviews } from '@/review/ReviewContext';
import { useBookings } from '@/booking/BookingContext';
import { useNotifications } from '@/notifications/NotificationContext';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/components/Toast';
import { Star, MessageSquare } from 'lucide-react';

export function StudentReviews() {
  const { reviews, addReview, getBookingReview } = useReviews();
  const { bookings } = useBookings();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { toast } = useToast();
  const studentName = user?.name ?? 'Student';
  const studentAvatar = user?.avatar ?? '';
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<{ id: string; tutorId: string; tutorName: string; subject: string; tutorAvatar: string } | null>(null);

  const myReviews = reviews.filter((r) => r.studentName === studentName);
  const completedBookings = bookings.filter((b) => b.status === 'completed' && b.studentName === studentName);
  const pendingReviews = completedBookings.filter((b) => !getBookingReview(b.id));

  const openReview = (booking: typeof completedBookings[number]) => {
    setSelectedBooking({
      id: booking.id,
      tutorId: booking.tutorId,
      tutorName: booking.tutorName,
      subject: booking.subject,
      tutorAvatar: booking.tutorAvatar,
    });
    setRating(5);
    setComment('');
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedBooking || !comment.trim()) return;
    addReview({
      bookingId: selectedBooking.id,
      tutorId: selectedBooking.tutorId,
      tutorName: selectedBooking.tutorName,
      studentName,
      studentAvatar,
      rating,
      comment: comment.trim(),
      subject: selectedBooking.subject,
    });
    addNotification({
      title: 'Review submitted',
      description: `Your review for ${selectedBooking.tutorName} has been published.`,
      type: 'review',
    });
    toast('Review submitted successfully!', 'success');
    setOpen(false);
    setComment('');
    setRating(5);
    setSelectedBooking(null);
  };

  return (
    <DashboardShell role="student">
      <PageHeader title="My Reviews" subtitle="Reviews you've written and sessions ready to review." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-slate-900">Written reviews</h2>
          {myReviews.length > 0 ? (
            myReviews.map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{r.subject}</p>
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">Review for {r.tutorName}</p>
                    <Rating value={r.rating} />
                    <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No reviews yet"
              description="After completing a session, you can share your experience with the tutor."
            />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 mb-4">Pending reviews</h2>
          {pendingReviews.length > 0 ? (
            <div className="space-y-3">
              {pendingReviews.map((b) => (
                <div key={b.id} className="card p-4">
                  <div className="flex items-center gap-3">
                    <img src={b.tutorAvatar} alt={b.tutorName} className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{b.subject}</p>
                      <p className="text-xs text-slate-500">{b.tutorName}</p>
                    </div>
                  </div>
                  <button onClick={() => openReview(b)} className="btn-primary w-full mt-3 text-sm py-2">
                    <Star className="w-4 h-4" /> Write review
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No pending reviews.</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Write a review">
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <img src={selectedBooking.tutorAvatar} alt={selectedBooking.tutorName} className="w-12 h-12 rounded-full bg-slate-100" />
              <div>
                <p className="font-medium text-slate-900">{selectedBooking.tutorName}</p>
                <p className="text-xs text-slate-500">{selectedBooking.subject}</p>
              </div>
            </div>

            <div>
              <p className="label">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} onClick={() => setRating(i)}>
                    <Star className={`w-8 h-8 transition-colors ${i <= rating ? 'text-accent-400 fill-accent-400' : 'text-slate-300 hover:text-slate-400'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Your review</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input min-h-[120px] resize-none"
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSubmit} disabled={!comment.trim()} className="btn-primary">Submit review</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
