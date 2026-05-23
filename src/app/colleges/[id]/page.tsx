'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface CollegeDetail {
  id: string; name: string; location: string; state: string
  fees: number; rating: number; type: string; overview: string
  courses: { id: string; name: string; duration: string; fees: number }[]
  placements: { avgPackage: number; highestPackage: number; placementRate: number; topRecruiters: string[] } | null
  reviews: { id: string; rating: number; comment: string; author: string; createdAt: string }[]
}

export default function CollegeDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [college, setCollege] = useState<CollegeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetch(`/api/colleges/${id}`).then(r => r.json()).then(d => { setCollege(d); setLoading(false) })
    if (session) {
      fetch(`/api/saved/check?collegeId=${id}`).then(r => r.json()).then(d => setSaved(d.saved))
    }
  }, [id, session])

  const handleSave = async () => {
    if (!session) { router.push('/auth/login'); return }
    const res = await fetch('/api/saved', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId: id })
    })
    const data = await res.json()
    setSaved(data.saved)
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-xl mb-6" />
      <div className="space-y-3"><div className="bg-gray-200 h-8 rounded w-1/2" /><div className="bg-gray-200 h-4 rounded w-1/3" /></div>
    </div>
  )
  if (!college) return <div className="text-center py-20 text-gray-500">College not found</div>

  const tabs = ['overview', 'courses', 'placements', 'reviews']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/colleges" className="text-blue-600 hover:underline text-sm mb-6 inline-flex items-center gap-1">
        ← Back to colleges
      </Link>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl p-8 text-white mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-3 inline-block">{college.type}</span>
            <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
            <p className="text-blue-100 flex items-center gap-1">
              📍 {college.location}, {college.state}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">⭐ {college.rating}</div>
              <div className="text-xs text-blue-200">{college.reviews.length} reviews</div>
            </div>
            <button onClick={handleSave}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${saved ? 'bg-yellow-400 text-gray-900' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
              {saved ? '🔖 Saved' : '+ Save College'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-blue-200 text-xs mb-1">Annual Fees</p>
            <p className="font-bold text-lg">₹{(college.fees / 100000).toFixed(1)}L</p>
          </div>
          {college.placements && (
            <>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs mb-1">Avg Package</p>
                <p className="font-bold text-lg">₹{(college.placements.avgPackage / 100000).toFixed(1)}L</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs mb-1">Placement Rate</p>
                <p className="font-bold text-lg">{college.placements.placementRate}%</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <p className="text-gray-700 leading-relaxed">{college.overview}</p>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-3">
              {college.courses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                  <div>
                    <p className="font-semibold text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">Duration: {course.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">₹{(course.fees / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-gray-400">per year</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'placements' && college.placements && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Avg Package', value: `₹${(college.placements.avgPackage / 100000).toFixed(1)}L` },
                  { label: 'Highest Package', value: `₹${(college.placements.highestPackage / 100000).toFixed(1)}L` },
                  { label: 'Placement Rate', value: `${college.placements.placementRate}%` },
                ].map(s => (
                  <div key={s.label} className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-3">Top Recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {college.placements.topRecruiters.map(r => (
                    <span key={r} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {college.reviews.length === 0
                ? <p className="text-gray-400 text-center py-8">No reviews yet</p>
                : college.reviews.map(r => (
                  <div key={r.id} className="p-4 bg-gray-50 rounded-xl border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{r.author}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
