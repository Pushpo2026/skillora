import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader, Badge, statusBadge } from '@/components/ui';
import { earnings } from '@/data/mock';
import { DollarSign, TrendingUp, Wallet, Clock, Download } from 'lucide-react';

export function TutorEarnings() {
  const paid = earnings.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount, 0);
  const pending = earnings.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
  const processing = earnings.filter((e) => e.status === 'processing').reduce((s, e) => s + e.amount, 0);
  const total = paid + pending + processing;
  const safePct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  return (
    <DashboardShell role="tutor">
      <PageHeader title="Earnings" subtitle="Track your income and payment history." action={<button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Wallet} label="Total earnings" value={`$${total.toFixed(0)}`} accent="brand" />
        <StatCard icon={DollarSign} label="Available" value={`$${paid.toFixed(0)}`} accent="blue" />
        <StatCard icon={Clock} label="Pending" value={`$${pending.toFixed(0)}`} accent="accent" />
        <StatCard icon={TrendingUp} label="This month" value={`$${paid.toFixed(0)}`} trend={{ value: '12%', up: true }} accent="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Transaction history</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-900">{e.student}</td>
                    <td className="py-3 text-slate-600">{e.subject}</td>
                    <td className="py-3 text-slate-500">{e.date}</td>
                    <td className="py-3 text-right font-semibold text-slate-900">${e.amount}</td>
                    <td className="py-3"><Badge color={statusBadge(e.status)}>{e.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Payout method</h3>
            <div className="p-4 rounded-xl bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center"><Wallet className="w-5 h-5 text-brand-600" /></div>
              <div>
                <p className="text-sm font-medium text-slate-900">Bank •• 4521</p>
                <p className="text-xs text-slate-500">Next payout: Aug 15</p>
              </div>
            </div>
            <button className="btn-secondary w-full mt-3">Update payout method</button>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Earnings breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Available</span><span className="font-medium text-brand-600">${paid.toFixed(2)}</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-brand-500" style={{ width: `${safePct(paid)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Processing</span><span className="font-medium text-accent-600">${processing.toFixed(2)}</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-accent-400" style={{ width: `${safePct(processing)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Pending</span><span className="font-medium text-slate-500">${pending.toFixed(2)}</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-slate-400" style={{ width: `${safePct(pending)}%` }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
