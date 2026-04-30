'use client';
import { useCompareStore } from '@/store/compareStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCompare } from '@/lib/api';
import { X, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { ids, remove, clear } = useCompareStore();

  const { data: colleges, isLoading } = useQuery({
    queryKey: ['compare', ids],
    queryFn: () => fetchCompare(ids),
    enabled: ids.length >= 2,
  });

  if (ids.length < 2)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart2 className="text-purple-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Compare Colleges
        </h1>
        <p className="text-gray-500 mb-6">
          Select at least 2 colleges from the listing page by clicking the{' '}
          <strong>+</strong> button on each college card.
        </p>
        <Link
          href="/colleges"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    );

  const rows = [
    { label: 'Location', fn: (c: any) => c.location },
    { label: 'Type', fn: (c: any) => c.type },
    { label: 'Established', fn: (c: any) => c.established },
    {
      label: 'Annual Fees',
      fn: (c: any) => `₹${(c.fees / 100000).toFixed(1)}L`,
    },
    { label: 'Rating', fn: (c: any) => `${c.rating} / 5` },
    { label: 'NIRF Rank', fn: (c: any) => (c.nirf ? `#${c.nirf}` : 'N/A') },
    {
      label: 'Total Students',
      fn: (c: any) => c.totalStudents?.toLocaleString(),
    },
    {
      label: 'Avg Package (2024)',
      fn: (c: any) =>
        c.placements?.[0]
          ? `₹${c.placements[0].avgPackage.toFixed(1)}L`
          : 'N/A',
    },
    {
      label: 'Max Package (2024)',
      fn: (c: any) =>
        c.placements?.[0]
          ? `₹${c.placements[0].maxPackage.toFixed(1)}L`
          : 'N/A',
    },
    {
      label: 'Placement %',
      fn: (c: any) =>
        c.placements?.[0]
          ? `${c.placements[0].placementPct.toFixed(0)}%`
          : 'N/A',
    },
    {
      label: 'Courses Offered',
      fn: (c: any) =>
        c.courses?.length ? `${c.courses.length} courses` : 'N/A',
    },
    {
      label: 'Top Recruiters',
      fn: (c: any) => c.placements?.[0]?.topRecruiters || 'N/A',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
        <button
          onClick={clear}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear all
        </button>
      </div>

      {isLoading ? (
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-500 text-sm w-40">
                  Feature
                </th>
                {colleges?.map((c: any) => (
                  <th key={c.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {c.name}
                      </span>
                      <button
                        onClick={() => remove(c.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {row.label}
                  </td>
                  {colleges?.map((c: any) => (
                    <td
                      key={c.id}
                      className="p-4 text-center text-sm text-gray-900"
                    >
                      {row.fn(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}