import Link from 'next/link';
import { Search, BarChart2, Zap, MessageCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Search,
      title: 'Search & Filter',
      desc: 'Find colleges by location, fees, courses and more',
      href: '/colleges',
      color: 'blue',
    },
    {
      icon: BarChart2,
      title: 'Compare Colleges',
      desc: 'Side-by-side comparison of fees, placement, ratings',
      href: '/compare',
      color: 'purple',
    },
    {
      icon: Zap,
      title: 'Rank Predictor',
      desc: 'Enter your JEE rank and see which colleges you qualify for',
      href: '/predict',
      color: 'amber',
    },
    {
      icon: MessageCircle,
      title: 'Q&A Forum',
      desc: 'Ask questions and get answers from students and alumni',
      href: '/qa',
      color: 'green',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Perfect College
          </h1>
          <p className="text-xl text-blue-100 mb-10">
            Search, compare and decide with data-driven insights across 500+
            colleges
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/colleges"
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Browse Colleges
            </Link>
            <Link
              href="/predict"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Predict My College
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Colleges Listed', value: '20+' },
            { label: 'Student Reviews', value: '60+' },
            { label: 'States Covered', value: '10+' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to decide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-${f.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <f.icon className={`text-${f.color}-600`} size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}