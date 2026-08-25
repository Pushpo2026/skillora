import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader } from '@/components/ui';
import { availabilitySlots } from '@/data/mock';
import { Plus, Trash2, Clock } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function TutorAvailability() {
  const [slots, setSlots] = useState(availabilitySlots);

  const toggleBooked = (id: string) =>
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, booked: !s.booked } : s)));

  const remove = (id: string) => setSlots((prev) => prev.filter((s) => s.id !== id));

  return (
    <DashboardShell role="tutor">
      <PageHeader title="Availability & Schedule" subtitle="Set your teaching hours so students can book you." action={<button className="btn-primary"><Plus className="w-4 h-4" /> Add time slot</button>} />

      <div className="card p-5 mb-6 bg-brand-50 border-brand-100">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-brand-800">How availability works</p>
            <p className="text-sm text-brand-700 mt-0.5">Students can only book sessions during your available time slots. Booked slots are automatically marked as unavailable.</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => {
          const daySlots = slots.filter((s) => s.day === day);
          return (
            <div key={day} className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">{day}</h3>
              {daySlots.length > 0 ? (
                <div className="space-y-2">
                  {daySlots.map((s) => (
                    <div key={s.id} className={`flex items-center justify-between p-2.5 rounded-lg border ${s.booked ? 'border-slate-200 bg-slate-50' : 'border-brand-200 bg-brand-50'}`}>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{s.start} – {s.end}</p>
                        <p className={`text-xs ${s.booked ? 'text-slate-400' : 'text-brand-600'}`}>{s.booked ? 'Booked' : 'Available'}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => toggleBooked(s.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${s.booked ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                          {s.booked ? '✓' : '○'}
                        </button>
                        <button onClick={() => remove(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 py-4 text-center">No slots set</p>
              )}
              <button className="mt-3 w-full py-2 rounded-lg text-sm text-brand-600 border border-dashed border-brand-200 hover:bg-brand-50 transition-colors">
                <Plus className="w-3.5 h-3.5 inline mr-1" /> Add slot
              </button>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
