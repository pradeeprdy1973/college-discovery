'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface College {
  id: string
  name: string
  location: string
  state: string
  fees: number
  rating: number
  type: string
  placements?: { avgPackage: number; placementRate: number } | null
  _count?: { reviews: number }
}

interface CollegeCardProps {
  college: College
  compareIds?: string[]
  onCompareToggle?: (id: string) => void
}

export default function CollegeCard({ college, compareIds = [], onCompareToggle }: CollegeCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch(`/api/saved/check?collegeId=${college.id}`)
      .then(r => r.json())
      .then(d => setSaved(d.saved))
  }, [session, college.id])

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session) { router.push('/auth/login'); return }
    setSaving(true)
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId: college.id })
    })
    const data = await res.json()
    setSaved(data.saved)
    setSaving(false)
  }

  const inCompare = compareIds.includes(college.id)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-24 flex items-center justify-center relative">
        <span className="text-white text-3xl font-bold opacity-20">{college.name[0]}</span>
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">{college.type}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="absolute top-3 left-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <svg className={`w-4 h-4 ${saved ? 'text-yellow-300 fill-yellow-300' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{college.name}</h3>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span className="text-sm font-semibold text-gray-700">{college.rating}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {college.location}, {college.state}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Annual Fees</p>
            <p className="font-bold text-gray-900 text-sm">₹{(college.fees / 100000).toFixed(1)}L</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Avg Package</p>
            <p className="font-bold text-gray-900 text-sm">
              {college.placements ? `₹${(college.placements.avgPackage / 100000).toFixed(1)}L` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/colleges/${college.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm text-center py-2 rounded-lg transition-colors font-medium">
            View Details
          </Link>
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(college.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                inCompare
                  ? 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {inCompare ? '✓' : '+'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
