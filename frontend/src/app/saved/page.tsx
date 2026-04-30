'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchSaved } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  const { token } = useAuthStore();

  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ['saved'],
    queryFn: fetchSaved,
    enabled: !!token,
  });

  if (!token)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bookmark className="text-blue-600" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Saved Colleges
        </h1>
        <p className="text-gray-500 mb-6">
          Please login to see your saved colleges.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Saved Colleges
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Bookmark className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="mb-4">No saved colleges yet.</p>
          <Link
            href="/colleges"
            className="text-blue-600 hover:underline font-medium"
          >
            Browse colleges →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.map((c: any) => (
            <CollegeCard key={c.id} college={c} />
          ))}
        </div>
      )}
    </div>
  );
}