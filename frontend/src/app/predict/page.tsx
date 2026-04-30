'use client';
import { useState } from 'react';
import { predict } from '@/lib/api';
import { Zap, ChevronRight, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function PredictPage() {
  const [exam, setExam] = useState('JEE Advanced');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handlePredict = async () => {
    if (!rank) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await predict(exam, Number(rank));
      setResults(data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const chanceStyle = (c: string) =>
    ({
      High: 'bg-green-100 text-green-700',
      Medium: 'bg-amber-100 text-amber-700',
      Low: 'bg-red-100 text-red-700',
    }[c] || '');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="text-amber-600" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">College Predictor</h1>
        <p className="text-gray-500 mt-2">
          Enter your entrance exam rank to see colleges you can get into
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Select Exam
            </label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {[
                'JEE Advanced',
                'JEE Main',
                'BITSAT',
                'VITEEE',
                'MHT-CET',
              ].map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Your Rank
            </label>
            <input
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              type="number"
              placeholder="e.g. 5000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
            />
          </div>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading || !rank}
          className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Predicting...' : 'Predict My Colleges'}
        </button>
      </div>

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="mx-auto mb-3 text-gray-300" size={48} />
          <p>No colleges found for this rank and exam combination.</p>
          <p className="text-sm mt-1">
            Try a different exam or adjust your rank.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">
            {results.length} colleges found for rank {rank} in {exam}
          </h2>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {r.college.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {r.course} · Rank range: {r.minRank?.toLocaleString()}–
                    {r.maxRank?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${chanceStyle(r.chance)}`}
                  >
                    {r.chance} chance
                  </span>
                  <Link
                    href={`/colleges/${r.college.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}