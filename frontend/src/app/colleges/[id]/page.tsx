'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchCollege, saveCollege, unsaveCollege } from '@/lib/api';
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { useState, use } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tab, setTab] = useState<'courses' | 'placements' | 'reviews' | 'qa'>(
    'courses'
  );
  const [saved, setSaved] = useState(false);
  const { token } = useAuthStore();

  const { data: college, isLoading } = useQuery({
    queryKey: ['college', id],
    queryFn: () => fetchCollege(Number(id)),
  });

  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse mb-4" />
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );

  if (!college)
    return (
      <div className="p-8 text-center text-gray-500">College not found</div>
    );

  const handleSave = async () => {
    if (!token) return alert('Please login to save colleges');
    if (saved) {
      await unsaveCollege(college.id);
      setSaved(false);
    } else {
      await saveCollege(college.id);
      setSaved(true);
    }
  };

  const latestPlacement = college.placements?.[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 h-28 flex items-center justify-center relative">
          {college.imageUrl ? (
            <img
              src={college.imageUrl}
              alt={college.name}
              className="h-20 w-20 object-contain bg-white rounded-xl p-2 shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold text-3xl shadow-lg">
              {college.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {college.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {college.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Est. {college.established}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />{' '}
                  {college.totalStudents?.toLocaleString()} students
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                <Star
                  size={16}
                  className="text-amber-500"
                  fill="currentColor"
                />
                <span className="font-semibold text-gray-900">
                  {college.rating}
                </span>
              </div>
              <button
                onClick={handleSave}
                className={`p-2.5 rounded-lg border transition-colors ${
                  saved
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-200 text-gray-400 hover:border-blue-400'
                }`}
              >
                {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              {
                label: 'Annual Fees',
                value: `₹${(college.fees / 100000).toFixed(1)}L`,
              },
              { label: 'College Type', value: college.type },
              {
                label: 'Avg Package',
                value: latestPlacement
                  ? `₹${latestPlacement.avgPackage.toFixed(1)}L`
                  : 'N/A',
              },
              {
                label: 'Placement %',
                value: latestPlacement
                  ? `${latestPlacement.placementPct.toFixed(0)}%`
                  : 'N/A',
              },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="font-semibold text-gray-900 text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm">{college.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {(['courses', 'placements', 'reviews', 'qa'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                tab === t
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'qa' ? 'Q&A' : t}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Courses Tab */}
          {tab === 'courses' && (
            <div className="space-y-3">
              {college.courses?.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.duration} · {c.seats} seats · Exam: {c.exam}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-semibold text-gray-900 text-sm">
                      ₹{(c.fees / 100000).toFixed(1)}L
                    </p>
                    {c.minRank && (
                      <p className="text-xs text-gray-500">
                        Rank: {c.minRank}–{c.maxRank}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Placements Tab */}
          {tab === 'placements' && (
            <div className="space-y-4">
              {college.placements?.map((p: any) => (
                <div
                  key={p.year}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Placements {p.year}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Avg Package</p>
                      <p className="font-semibold text-green-600">
                        ₹{p.avgPackage.toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Max Package</p>
                      <p className="font-semibold text-blue-600">
                        ₹{p.maxPackage.toFixed(1)}L
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Placement %</p>
                      <p className="font-semibold text-purple-600">
                        {p.placementPct.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Top Recruiters: {p.topRecruiters}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {tab === 'reviews' && (
            <div className="space-y-4">
              {college.reviews?.map((r: any) => (
                <div
                  key={r.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(r.rating)
                                ? 'text-amber-500'
                                : 'text-gray-200'
                            }
                            fill="currentColor"
                          />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {r.title}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{r.body}</p>
                  <p className="text-xs text-gray-400 mt-2">— {r.author}</p>
                </div>
              ))}
            </div>
          )}

          {/* Q&A Tab */}
          {tab === 'qa' && (
            <div>
              <Link
                href={`/qa?college=${college.id}`}
                className="inline-block mb-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View all Q&A for this college →
              </Link>
              {college.questions?.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No questions yet. Be the first to ask!
                </p>
              )}
              {college.questions?.map((q: any) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-lg p-4 mb-3"
                >
                  <p className="font-medium text-gray-900 text-sm">
                    {q.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {q.answers?.length || 0} answers · Asked by{' '}
                    {q.user?.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}