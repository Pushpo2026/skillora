import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { PageHeader, Badge, statusBadge, EmptyState } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { usePayments } from '@/payment/PaymentContext';
import { useToast } from '@/components/Toast';
import { DollarSign, CreditCard, TrendingUp, RefreshCw, Download, RotateCcw, AlertTriangle, Receipt } from 'lucide-react';

export function AdminPayments() {
  const { payments, updatePaymentStatus } = usePayments();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'processing' | 'refunded' | 'failed'>('all');
  const [refundTarget, setRefundTarget] = useState<{ id: string; student: string; amount: number } | null>(null);

  const shown = filter === 'all' ? payments : payments.filter((p) => p.status === filter);

  const completed = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const processing = payments.filter((p) => p.status === 'processing').reduce((s, p) => s + p.amount, 0);
  const avg = payments.length > 0 ? (payments.reduce((s, p) => s + p.amount, 0) / payments.length).toFixed(0) : '0';

  const handleRefund = () => {
    if (!refundTarget) return;
    updatePaymentStatus(refundTarget.id, 'refunded');
    toast(`Refund of $${refundTarget.amount.toFixed(2)} issued to ${refundTarget.student}.`, 'info');
    setRefundTarget(null);
  };

  return (
    <DashboardShell role="admin">
      <PageHeader title="Manage Payments" subtitle="Track and manage all platform transactions." action={<button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total processed" value={`$${completed.toFixed(0)}`} accent="brand" />
        <StatCard icon={RefreshCw} label="Processing" value={`$${processing.toFixed(0)}`} accent="accent" />
        <StatCard icon={CreditCard} label="Pending" value={`$${pending.toFixed(0)}`} accent="blue" />
        <StatCard icon={TrendingUp} label="Avg. transaction" value={`$${avg}`} accent="violet" />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'completed', 'pending', 'processing', 'refunded', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f} {f !== 'all' && `(${payments.filter((p) => p.status === f).length})`}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Tutor</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">#{p.id.toUpperCase()}</td>
                    <td className="px-4 py-3 text-slate-700">{p.studentName}</td>
                    <td className="px-4 py-3 text-slate-700">{p.tutorName}</td>
                    <td className="px-4 py-3 text-slate-600">{p.methodLabel}</td>
                    <td className="px-4 py-3 text-slate-600">{p.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3"><Badge color={statusBadge(p.status)}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      {p.status === 'completed' && (
                        <button
                          onClick={() => setRefundTarget({ id: p.id, student: p.studentName, amount: p.amount })}
                          className="btn-secondary text-xs px-3 py-1.5 text-red-600 hover:bg-red-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Refund
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
        <EmptyState icon={Receipt} title="No transactions found" description="There are no payments matching this filter." />
      )}

      <Modal
        open={!!refundTarget}
        onClose={() => setRefundTarget(null)}
        title="Issue refund?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-slate-600">
              You are about to refund <span className="font-bold text-slate-900">${refundTarget?.amount.toFixed(2)}</span> to{' '}
              <span className="font-medium text-slate-900">{refundTarget?.student}</span>. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRefundTarget(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleRefund} className="btn-danger">
              <RotateCcw className="w-4 h-4" /> Issue refund
            </button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
