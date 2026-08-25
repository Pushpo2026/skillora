import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TutorCard } from '@/components/TutorCard';
import { tutors } from '@/data/mock';
import { parseRequirement, recommendTutors, type AIRequirement, type AIRecommendation } from '@/services/aiRecommend';
import { Sparkles, Brain, Wand2, ArrowRight, RotateCcw, Lightbulb, Target, DollarSign, Clock, Star, Award, Loader2 } from 'lucide-react';
import { Link } from '@/router';

const EXAMPLES = [
  'I need a Python tutor for beginners, budget 500 taka, available at night',
  'Looking for an advanced physics tutor with 5+ years experience, $70/hr max',
  'Beginner Spanish, evenings, budget $40, rating 4.5+',
  'Statistics tutor, intermediate level, flexible schedule, $50/hr',
];

export function AIRecommendPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<AIRequirement | null>(null);
  const [results, setResults] = useState<AIRecommendation[]>([]);

  const runMatch = () => {
    if (!input.trim()) return;
    setLoading(true);
    setParsed(null);
    setResults([]);
    setTimeout(() => {
      const req = parseRequirement(input);
      setParsed(req);
      setResults(recommendTutors(req, tutors));
      setLoading(false);
    }, 1800);
  };

  const reset = () => {
    setInput('');
    setParsed(null);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" /> AI Tutor Matching
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold font-display text-slate-900">Find your perfect tutor with AI</h1>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Describe what you need in plain English. Our AI will analyze your requirements and match you with the best tutors.
          </p>
        </div>

        {/* Input */}
        {!loading && !parsed && (
          <div className="card p-6 sm:p-8 max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-slate-900">Tell us what you need</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Include subject, skill level, budget, availability, and any preferences.
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="e.g. I need a Python tutor for beginners, budget 500 taka, available at night"
            />
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-xs text-slate-600 transition-colors text-left"
                  >
                    {ex.length > 50 ? ex.slice(0, 50) + '...' : ex}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button disabled={!input.trim()} onClick={runMatch} className="btn-primary">
                <Wand2 className="w-4 h-4" /> Get AI recommendations
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-brand-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Analyzing your requirements...</h3>
            <p className="text-sm text-slate-500 mt-1">Our AI is matching {tutors.length} tutors to your needs.</p>
            <div className="mt-4 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {parsed && !loading && (
          <div className="animate-fade-in">
            {/* Extracted criteria */}
            <div className="card p-5 mb-6 bg-gradient-to-r from-brand-50 to-white border-brand-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">AI-extracted requirements</h2>
                  <p className="text-sm text-slate-600 mt-0.5">Here's what we understood from your request.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <CriteriaCard icon={Target} label="Subject" value={parsed.subject ?? 'Any'} />
                <CriteriaCard icon={Award} label="Skill Level" value={parsed.skillLevel ?? 'Any'} />
                <CriteriaCard icon={DollarSign} label="Budget" value={parsed.budget !== null ? `$${parsed.budget}/hr` : 'Flexible'} />
                <CriteriaCard icon={Clock} label="Availability" value={parsed.availability ?? 'Flexible'} />
                <CriteriaCard icon={Star} label="Min Rating" value={parsed.minRating !== null ? `${parsed.minRating}+ stars` : 'Any'} />
                <CriteriaCard icon={Award} label="Experience" value={parsed.minExperience !== null ? `${parsed.minExperience}+ years` : 'Any'} />
              </div>
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display text-slate-900">
                {results.length > 0 ? `${results.length} tutors matched` : 'No matches found'}
              </h2>
              <button onClick={reset} className="btn-secondary text-sm">
                <RotateCcw className="w-4 h-4" /> Start over
              </button>
            </div>

            {/* Recommendation cards */}
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((rec, i) => (
                  <div key={rec.tutor.id} className="relative animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="grid lg:grid-cols-[1fr_300px] gap-4">
                      <div className="relative">
                        <span className="absolute -top-2 left-3 z-10 badge bg-brand-600 text-white">
                          {rec.matchScore}% match
                        </span>
                        <TutorCard tutor={rec.tutor} />
                      </div>
                      <div className="card p-5">
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-brand-600" /> Why this tutor?
                        </h3>
                        <ul className="space-y-2">
                          {rec.reasons.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                        <Link to={`/tutors/${rec.tutor.id}`} className="btn-primary w-full mt-4 text-sm">
                          View profile <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-slate-600">No tutors match your criteria. Try being more flexible with your budget or subject.</p>
                <button onClick={reset} className="btn-secondary mt-4">Try a new search</button>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-8 text-center">
                <Link to="/tutors" className="btn-primary">Browse all tutors <ArrowRight className="w-4 h-4" /></Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function CriteriaCard({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className="text-sm font-semibold text-slate-900 capitalize">{value}</p>
    </div>
  );
}
