import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Find Your Perfect<br />
            <span className="text-yellow-300">College in India</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Search, compare, and discover the best colleges based on fees, ratings, placements, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colleges" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg">
              🔍 Explore Colleges
            </Link>
            <Link href="/compare" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg backdrop-blur-sm">
              ⚖️ Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '8+', label: 'Top Colleges' },
            { value: '4', label: 'Features' },
            { value: '100%', label: 'Free to Use' },
            { value: '24/7', label: 'Available' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-blue-600 mb-1">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything You Need</h2>
        <p className="text-center text-gray-500 mb-12">Make informed decisions with our powerful tools</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔍', title: 'Smart Search', desc: 'Search by name, location, type with real-time filters', href: '/colleges' },
            { icon: '📋', title: 'Detailed Info', desc: 'Courses, placements, reviews all in one page', href: '/colleges' },
            { icon: '⚖️', title: 'Compare', desc: 'Side-by-side comparison of up to 3 colleges', href: '/compare' },
            { icon: '🔖', title: 'Save & Track', desc: 'Save favorite colleges and revisit anytime', href: '/saved' },
          ].map(f => (
            <Link key={f.title} href={f.href} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find your college?</h2>
        <p className="text-gray-500 mb-8">Join thousands of students making smarter decisions</p>
        <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg inline-block">
          Get Started Free →
        </Link>
      </section>
    </div>
  )
}
