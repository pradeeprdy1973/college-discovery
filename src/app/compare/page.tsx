'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface College {
  id: string; name: string; location: string; state: string
  fees: number; rating: number; type: string; overview: string
  courses: { id: string; name: string; duration: string; fees: number }[]
  placements: { avgPackage: number; highestPackage: number; placementRate: number; topRecruiters: string[] } | null
  reviews: { id: string; rating: number }[]
}

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (ids.length < 2) return
    setLoading(true)
    fetch(`/api/compare?ids=${ids.join(',')}`)
      .then(r => r.json())
      .then(d => { setColleges(d); setLoading(false) })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [ids.join(',')])

  if (ids.length < 2) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">⚖️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Colleges</h2>
      <p className="text-gray-500 mb-8">Select 2 or 3 colleges from the listing to compare them side by side.</p>
      <Link href="/colleges" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl inline-block transition-colors">
        Browse Colleges →
      </Link>
    </div>
  )

  if (loading) return <div className="text-center py-20 text-gray-500">Loading comparison...</div>
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>

  const rows = [
    { label: 'Location', key: (c: College) => `${c.location}, ${c.state}` },
    { label: 'Type', key: (c: College) => c.type },
    { label: 'Annual Fees', key: (c: College) => `₹${(c.fees / 100000).toFixed(1)}L` },
    { label: 'Rating', key: (c: College) => `⭐ ${c.rating}/5` },
    { label: 'Avg Package', key: (c: College) => c.placements ? `₹${(c.placements.avgPackage / 100000).toFixed(1)}L` : 'N/A' },
    { label: 'Highest Package', key: (c: College) => c.placements ? `₹${(c.placements.highestPackage / 100000).toFixed(1)}L` : 'N/A' },
    { label: 'Placement Rate', key: (c: College) => c.placements ? `${c.placements.placementRate}%` : 'N/A' },
    { label: 'Courses', key: (c: College) => `${c.courses.length} courses` },
    { label: 'Reviews', key: (c: College) => `${c.reviews.length} reviews` },
    { label: 'Top Recruiter', key: (c: College) => c.placements?.topRecruiters[0] || 'N/A' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">College Comparison</h1>
          <p className="text-gray-500 mt-1">Comparing {colleges.length} colleges</p>
        </div>
        <Link href="/colleges" className="text-blue-600 hover:underline text-sm">← Change selection</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* College headers */}
        <div className="grid border-b" style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}>
          <div className="p-4 bg-gray-50 border-r" />
          {colleges.map(c => (
            <div key={c.id} className="p-6 text-center border-r last:border-r-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">{c.name[0]}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{c.name}</h3>
              <p className="text-gray-400 text-xs mt-1">{c.location}</p>
              <Link href={`/colleges/${c.id}`} className="text-blue-600 hover:underline text-xs mt-2 inline-block">
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        {rows.map((row, i) => (
          <div key={row.label} className={`grid border-b last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}>
            <div className="p-4 border-r font-medium text-gray-600 text-sm flex items-center">{row.label}</div>
            {colleges.map(c => (
              <div key={c.id} className="p-4 text-center border-r last:border-r-0 text-sm font-semibold text-gray-800 flex items-center justify-center">
                {row.key(c)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Top recruiters comparison */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Recruiters Comparison</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
          {colleges.map(c => (
            <div key={c.id}>
              <p className="text-sm font-semibold text-gray-700 mb-2">{c.name.split(' ')[0]}</p>
              <div className="flex flex-wrap gap-1">
                {c.placements?.topRecruiters.map(r => (
                  <span key={r} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><CompareContent /></Suspense>
}
