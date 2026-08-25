import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, EmptyState } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { pendingTutors } from '@/data/mock';
import { useToast } from '@/components/Toast';
import { Check, X, ShieldCheck, FileText, GraduationCap, Clock, AlertTriangle } from 'lucide-react';

export function AdminVerification() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<'approve' | 'reject' | null>(null);
  const [selected, setSelected] = useState(pendingTutors[0]);
  const [list, setList] = useState(pendingTutors);

  const openReview = (t: typeof pendingTutors[number]) => {
    setSelected(t);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (confirm === 'approve') {
      setList((prev) => prev.filter((t) => t.id !== selected.id));
      toast(`${selected.name} approved as a tutor.`, 'success');
    } else if (confirm === 'reject') {
      setList((prev) => prev.filter((t) => t.id !== selected.id));
      toast(`${selected.name}'s application rejected.`, 'error');
    }
    setConfirm(null);
    setOpen(false);
  };

  return (
    <DashboardShell role="admin">
      <PageHeader title="Tutor Verification" subtitle={`${list.length} tutors awaiting verification.`} />

      {list.length > 0 ? (
        <div className="space-y-4">
          {list.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full bg-slate-100" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <p className="text-sm text-slate-500">{t.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.subjects.map((s) => <span key={s} className="badge bg-brand-50 text-brand-700">{s}</span>)}
                    </div>
                    <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-500"><GraduationCap className="w-4 h-4" /> {t.education[0]}</div>
                      <div className="flex items-center gap-2 text-slate-500"><Clock className="w-4 h-4" /> {t.experienceYears} years experience</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
                  <Badge color="amber">Pending</Badge>
                  <button onClick={() => openReview(t)} className="btn-primary text-sm">Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={ShieldCheck} title="All caught up!" description="No tutors pending verification." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Verify tutor" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={selected.avatar} alt={selected.name} className="w-16 h-16 rounded-full bg-slate-100" />
            <div>
              <h3 className="font-semibold text-slate-900">{selected.name}</h3>
              <p className="text-sm text-slate-500">{selected.title}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><FileText className="w-3.5 h-3.5" /> ID Document</p>
              <p className="text-sm font-medium text-slate-900">passport.pdf</p>
              <Badge color="brand">Verified</Badge>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><GraduationCap className="w-3.5 h-3.5" /> Credentials</p>
              <p className="text-sm font-medium text-slate-900">degree.pdf</p>
              <Badge color="brand">Verified</Badge>
            </div>
          </div>

          <div>
            <p className="label">Bio</p>
            <p className="text-sm text-slate-600 p-3 rounded-lg bg-slate-50">{selected.bio}</p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setConfirm('reject')} className="btn-danger"><X className="w-4 h-4" /> Reject</button>
            <button onClick={() => setConfirm('approve')} className="btn-primary"><Check className="w-4 h-4" /> Approve tutor</button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === 'approve' ? 'Approve tutor?' : 'Reject application?'}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${confirm === 'approve' ? 'bg-brand-100' : 'bg-red-100'}`}>
              {confirm === 'approve' ? <Check className="w-5 h-5 text-brand-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
            </div>
            <p className="text-sm text-slate-600">
              {confirm === 'approve'
                ? `Approve ${selected.name}? They will be listed as a verified tutor and can start receiving bookings.`
                : `Reject ${selected.name}'s application? They will be notified and removed from the pending queue.`}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirm(null)} className="btn-secondary">Cancel</button>
            <button
              onClick={handleConfirm}
              className={confirm === 'approve' ? 'btn-primary' : 'btn-danger'}
            >
              {confirm === 'approve' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {confirm === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  );
}
