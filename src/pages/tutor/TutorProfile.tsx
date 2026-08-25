import { DashboardShell } from '@/components/Sidebar';
import { PageHeader } from '@/components/ui';
import { Rating } from '@/components/Rating';
import { tutors, reviews } from '@/data/mock';
import { BadgeCheck, Award, MapPin, Languages, Clock, Users, Star, Edit3 } from 'lucide-react';
import { Link } from '@/router';

export function TutorProfile() {
  const tutor = tutors[0];

  return (
    <DashboardShell role="tutor">
      <PageHeader title="My Tutor Profile" subtitle="This is how students see your profile." action={<Link to="/tutor/edit-profile" className="btn-primary"><Edit3 className="w-4 h-4" /> Edit profile</Link>} />

      <div className="card overflow-hidden mb-6">
        <div className="h-28 bg-gradient-to-r from-brand-500 to-brand-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <img src={tutor.avatar} alt={tutor.name} className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-100 shadow-card" />
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{tutor.name}</h1>
                {tutor.verified && <BadgeCheck className="w-5 h-5 text-brand-600" />}
                {tutor.topRated && <span className="badge bg-accent-50 text-accent-700"><Award className="w-3 h-3" /> Top Rated</span>}
              </div>
              <p className="text-slate-600">{tutor.title}</p>
              <div className="mt-2 flex items-center gap-3 flex-wrap text-sm text-slate-500">
                <Rating value={tutor.rating} showValue count={tutor.reviewsCount} />
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tutor.location}</span>
              </div>
            </div>
            <div className="pb-1 text-right">
              <p className="text-3xl font-bold text-slate-900">${tutor.hourlyRate}<span className="text-base font-normal text-slate-400">/hr</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">About me</h2>
            <p className="text-slate-600 leading-relaxed">{tutor.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tutor.subjects.map((s) => <span key={s} className="badge bg-brand-50 text-brand-700">{s}</span>)}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Education & qualifications</h2>
            <ul className="space-y-3">
              {tutor.education.map((e) => (
                <li key={e} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                  <span className="text-slate-700">{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Reviews ({tutor.reviewsCount})</h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={r.authorAvatar} alt={r.author} className="w-9 h-9 rounded-full bg-slate-100" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{r.author}</p>
                      <Rating value={r.rating} />
                    </div>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Profile stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-slate-50">
                <Users className="w-5 h-5 text-brand-600 mx-auto" />
                <p className="mt-1 text-xl font-bold text-slate-900">{tutor.totalSessions}</p>
                <p className="text-xs text-slate-500">Sessions</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50">
                <Star className="w-5 h-5 text-accent-400 mx-auto fill-accent-400" />
                <p className="mt-1 text-xl font-bold text-slate-900">{tutor.rating}</p>
                <p className="text-xs text-slate-500">Rating</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-brand-600 mx-auto" />
                <p className="mt-1 text-xl font-bold text-slate-900">{tutor.experienceYears}y</p>
                <p className="text-xs text-slate-500">Experience</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50">
                <Languages className="w-5 h-5 text-brand-600 mx-auto" />
                <p className="mt-1 text-xl font-bold text-slate-900">{tutor.languages.length}</p>
                <p className="text-xs text-slate-500">Languages</p>
              </div>
            </div>
          </div>

          <div className="card p-5 bg-brand-50 border-brand-100">
            <h3 className="font-semibold text-brand-800">Profile completeness</h3>
            <div className="mt-3 h-2 rounded-full bg-brand-100 overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="mt-2 text-sm text-brand-700">85% complete — add a video intro to boost visibility.</p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
