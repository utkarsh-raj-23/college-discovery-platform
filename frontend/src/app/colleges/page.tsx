'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchColleges } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function CollegesPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minFees, setMinFees] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [course, setCourse] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [applied, setApplied] = useState({
    search: '',
    location: '',
    minFees: '',
    maxFees: '',
    course: '',
  });

  const params: Record<string, string> = {
    page: String(page),
    limit: '9',
  };
  if (applied.search) params.search = applied.search;
  if (applied.location) params.location = applied.location;
  if (applied.minFees) params.minFees = applied.minFees;
  if (applied.maxFees) params.maxFees = applied.maxFees;
  if (applied.course) params.course = applied.course;

  const { data, isLoading } = useQuery({
    queryKey: ['colleges', params],
    queryFn: () => fetchColleges(params),
    staleTime: 30000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ search, location, minFees, maxFees, course });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Explore Colleges
      </h1>

      {/* Search & Filter Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-xl border border-gray-200 p-4 mb-6"
      >
        <div className="flex gap-3 mb-0">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-400 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 mt-4 border-t border-gray-100">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="State (e.g. Tamil Nadu)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Course (e.g. Computer)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={minFees}
              onChange={(e) => setMinFees(e.target.value)}
              placeholder="Min fees (₹)"
              type="number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
              placeholder="Max fees (₹)"
              type="number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">
            {data?.total || 0} colleges found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {data?.colleges?.map((c: any) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-blue-400 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages, p + 1))
                }
                disabled={page === data.totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-blue-400 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}