import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TutorCard } from '@/components/TutorCard';
import { tutors, subjects } from '@/data/mock';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export function TutorSearchPage() {
  const [query, setQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = tutors.filter((t) => {
      const matchQuery =
        !query ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.subjects.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
        t.title.toLowerCase().includes(query.toLowerCase());
      const matchSubject = selectedSubjects.length === 0 || selectedSubjects.some((s) => t.subjects.includes(s));
      const matchPrice = t.hourlyRate <= maxPrice;
      const matchRating = t.rating >= minRating;
      return matchQuery && matchSubject && matchPrice && matchRating;
    });
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'price-low') list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate);
    if (sort === 'reviews') list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
    return list;
  }, [query, selectedSubjects, maxPrice, minRating, sort]);

  const toggleSubject = (s: string) =>
    setSelectedSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearFilters = () => {
    setSelectedSubjects([]);
    setMaxPrice(100);
    setMinRating(0);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display text-slate-900">Find your tutor</h1>
          <p className="mt-1 text-slate-500">Browse {tutors.length} verified expert tutors across {subjects.length} subjects.</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input pl-11 py-3 text-base"
              placeholder="Search by name, subject, or expertise..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary px-4 lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Clear all</button>
              </div>

              <div className="mb-5">
                <p className="label">Subjects</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {subjects.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(s)}
                        onChange={() => toggleSubject(s)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="label">Max price: ${maxPrice}/hr</p>
                <input type="range" min={20} max={100} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-brand-600" />
              </div>

              <div className="mb-5">
                <p className="label">Minimum rating</p>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm border ${
                        minRating === r ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">{filtered.length} tutors found</p>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input py-2 w-auto text-sm">
                <option value="rating">Highest rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="reviews">Most reviewed</option>
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((t) => (
                  <TutorCard key={t.id} tutor={t} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <X className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900">No tutors found</h3>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-secondary mt-4">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
