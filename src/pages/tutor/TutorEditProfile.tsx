import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader } from '@/components/ui';
import { tutors, subjects } from '@/data/mock';
import { Upload, Plus, X, Check } from 'lucide-react';

export function TutorEditProfile() {
  const tutor = tutors[0];
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(tutor.subjects);
  const [languages, setLanguages] = useState<string[]>(tutor.languages);

  const toggleSubject = (s: string) =>
    setSelectedSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <DashboardShell role="tutor">
      <PageHeader title="Edit Profile" subtitle="Update your tutor profile information." action={<button className="btn-primary"><Check className="w-4 h-4" /> Save changes</button>} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <img src={tutor.avatar} alt={tutor.name} className="w-28 h-28 rounded-full mx-auto bg-slate-100" />
          <button className="btn-secondary mt-4 w-full"><Upload className="w-4 h-4" /> Upload new photo</button>
          <p className="mt-2 text-xs text-slate-400">JPG or PNG, max 2MB</p>

          <div className="mt-6 pt-6 border-t border-slate-100 text-left">
            <h3 className="font-semibold text-slate-900 mb-3">Video intro</h3>
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
              <Upload className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="mt-2 text-sm text-slate-500">Upload a short video intro</p>
              <p className="text-xs text-slate-400">MP4, max 100MB, 1-2 min</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Basic information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">Full name</label><input className="input" defaultValue={tutor.name} /></div>
              <div><label className="label">Professional title</label><input className="input" defaultValue={tutor.title} /></div>
              <div><label className="label">Location</label><input className="input" defaultValue={tutor.location} /></div>
              <div><label className="label">Hourly rate ($)</label><input type="number" className="input" defaultValue={tutor.hourlyRate} /></div>
            </div>
            <div className="mt-4"><label className="label">Bio</label><textarea className="input min-h-[100px] resize-none" defaultValue={tutor.bio} /></div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedSubjects.includes(s) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {selectedSubjects.includes(s) && <Check className="w-3 h-3 inline mr-1" />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span key={l} className="badge bg-brand-50 text-brand-700 pr-1.5">
                  {l}
                  <button onClick={() => setLanguages((prev) => prev.filter((x) => x !== l))} className="ml-1 hover:text-brand-900"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="input flex-1" placeholder="Add a language..." />
              <button className="btn-secondary"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Education & qualifications</h3>
            <div className="space-y-3">
              {tutor.education.map((e) => (
                <div key={e} className="flex gap-2">
                  <input className="input flex-1" defaultValue={e} />
                  <button className="btn-secondary px-3"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button className="btn-ghost w-full border border-dashed border-slate-300"><Plus className="w-4 h-4" /> Add qualification</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
