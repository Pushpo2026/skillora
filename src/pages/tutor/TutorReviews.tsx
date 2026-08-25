import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/ui';
import { Rating } from '@/components/Rating';
import { reviews } from '@/data/mock';
import { Star, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';

export function TutorReviews() {
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <DashboardShell role="tutor">
      <PageHeader title="Reviews" subtitle="See what students say about your teaching." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Star} label="Average rating" value={avg.toFixed(1)} accent="accent" />
        <StatCard icon={MessageSquare} label="Total reviews" value={String(reviews.length)} accent="brand" />
        <StatCard icon={ThumbsUp} label="Would recommend" value="98%" accent="blue" />
        <StatCard icon={TrendingUp} label="Response rate" value="100%" accent="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Rating distribution</h3>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-8">{d.star}★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-accent-400 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-sm text-slate-500 w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start gap-3">
                <img src={r.authorAvatar} alt={r.author} className="w-11 h-11 rounded-full bg-slate-100" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{r.author}</p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Rating value={r.rating} />
                    <span className="text-xs text-slate-500">{r.subject}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                  <button className="mt-3 text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
