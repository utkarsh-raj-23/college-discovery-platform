'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Compass } from 'lucide-react';
import Link from 'next/link';

const questions = [
  {
    id: 1,
    question: 'What is your budget for annual fees?',
    options: [
      { label: 'Under ₹1.5L (Government colleges)', value: '150000' },
      { label: '₹1.5L — ₹3L (NITs and state colleges)', value: '300000' },
      { label: '₹3L — ₹5L (Private deemed universities)', value: '500000' },
      { label: 'Above ₹5L (Top private colleges)', value: '1000000' },
    ],
  },
  {
    id: 2,
    question: 'Which state do you prefer for college?',
    options: [
      { label: 'Tamil Nadu', value: 'Tamil Nadu' },
      { label: 'Delhi / NCR', value: 'Delhi' },
      { label: 'Maharashtra', value: 'Maharashtra' },
      { label: 'Any state is fine', value: 'any' },
    ],
  },
  {
    id: 3,
    question: 'Which course are you interested in?',
    options: [
      { label: 'Computer Science / IT', value: 'Computer Science' },
      { label: 'Electronics & Communication', value: 'Electronics' },
      { label: 'Mechanical Engineering', value: 'Mechanical' },
      { label: 'Civil Engineering', value: 'Civil' },
    ],
  },
  {
    id: 4,
    question: 'Which entrance exam are you appearing for?',
    options: [
      { label: 'JEE Advanced', value: 'JEE Advanced' },
      { label: 'JEE Main', value: 'JEE Main' },
      { label: 'BITSAT', value: 'BITSAT' },
      { label: 'VITEEE / State exam', value: 'VITEEE' },
    ],
  },
  {
    id: 5,
    question: 'What is your expected rank?',
    options: [
      { label: 'Under 1000 (Top IITs)', value: '1000' },
      { label: '1000 — 5000 (IITs / Top NITs)', value: '5000' },
      { label: '5000 — 15000 (NITs / Good private)', value: '15000' },
      { label: 'Above 15000 (State / Private colleges)', value: '50000' },
    ],
  },
];

interface Answers {
  budget?: string;
  state?: string;
  course?: string;
  exam?: string;
  rank?: string;
}

export default function FinderPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const keys = ['budget', 'state', 'course', 'exam', 'rank'] as const;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [keys[current]]: value };
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      findColleges(newAnswers);
    }
  };

  const findColleges = async (finalAnswers: Answers) => {
    setLoading(true);
    setDone(true);
    try {
      const params = new URLSearchParams();
      if (
        finalAnswers.state &&
        finalAnswers.state !== 'any'
      ) {
        params.set('location', finalAnswers.state);
      }
      if (finalAnswers.course) {
        params.set('course', finalAnswers.course);
      }
      if (finalAnswers.budget) {
        params.set('maxFees', finalAnswers.budget);
      }
      params.set('limit', '10');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/colleges?${params.toString()}`
      );
      const data = await res.json();

      // Calculate match score for each college
      const scored = (data.colleges || []).map((college: any) => {
        let score = 0;
        let reasons = [];

        if (
          finalAnswers.state === 'any' ||
          college.state
            ?.toLowerCase()
            .includes(finalAnswers.state?.toLowerCase() || '')
        ) {
          score += 20;
          reasons.push('Location match');
        }
        if (college.fees <= Number(finalAnswers.budget || 1000000)) {
          score += 25;
          reasons.push('Within budget');
        }
        if (college.type === 'Public') {
          score += 15;
          reasons.push('Government college');
        }
        if (college.rating >= 4.5) {
          score += 20;
          reasons.push('Highly rated');
        }
        if (college.nirf && college.nirf <= 20) {
          score += 20;
          reasons.push('Top 20 NIRF');
        }

        return { ...college, score, reasons };
      });

      scored.sort((a: any, b: any) => b.score - a.score);
      setResults(scored.slice(0, 8));
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setResults([]);
    setDone(false);
  };

  const progress = ((current) / questions.length) * 100;

  // Results Screen
  if (done) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="text-blue-600" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Your College Matches
          </h1>
          <p className="text-gray-500 mt-2">
            Based on your preferences we found these colleges for you
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">
              No colleges found matching your preferences.
            </p>
            <button
              onClick={restart}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {results.map((college: any, i: number) => (
                <div
                  key={college.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {college.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {college.location} · ₹
                        {(college.fees / 100000).toFixed(1)}L/year ·{' '}
                        {college.rating}⭐
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {college.reasons?.map((r: string) => (
                          <span
                            key={r}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Match</p>
                      <p className="font-bold text-green-600 text-lg">
                        {Math.min(college.score, 100)}%
                      </p>
                    </div>
                    <Link
                      href={`/colleges/${college.id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={restart}
                className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:border-blue-400 transition-colors"
              >
                Start Over
              </button>
              <Link
                href="/colleges"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Browse All Colleges
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  // Quiz Screen
  const q = questions[current];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Compass className="text-blue-600" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">College Finder</h1>
        <p className="text-gray-500 mt-2">
          Answer 5 quick questions to find your perfect college
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {q.question}
        </h2>
        <div className="space-y-3">
          {q.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="w-full text-left px-4 py-3.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700 flex items-center justify-between group"
            >
              {option.label}
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-blue-500 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Back Button */}
      {current > 0 && (
        <button
          onClick={() => setCurrent(current - 1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Go back
        </button>
      )}
    </div>
  );
}