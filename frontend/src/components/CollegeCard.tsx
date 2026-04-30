'use client';
import Link from 'next/link';
import { MapPin, Star, IndianRupee, PlusCircle, CheckCircle } from 'lucide-react';
import { useCompareStore } from '@/store/compareStore';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  type: string;
  nirf?: number;
  placements?: { avgPackage: number }[];
}

export default function CollegeCard({ college }: { college: College }) {
  const { ids, add, remove } = useCompareStore();
  const inCompare = ids.includes(college.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 flex items-center justify-center">
        <span className="text-white font-bold text-3xl">
          {college.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
            {college.name}
          </h3>
          <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-medium text-gray-700">
              {college.rating}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
          <MapPin size={12} />
          {college.location}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <IndianRupee size={12} />
          {(college.fees / 100000).toFixed(1)}L/year · {college.type}
        </div>
        {college.nirf && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
            NIRF #{college.nirf}
          </span>
        )}
        <div className="flex gap-2 mt-3">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 bg-blue-600 text-white text-xs font-medium py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={() => (inCompare ? remove(college.id) : add(college.id))}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
            className={`p-2 rounded-lg border transition-colors ${
              inCompare
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500'
            }`}
          >
            {inCompare ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}