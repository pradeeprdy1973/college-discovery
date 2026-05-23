'use client'
import { useState, useEffect, useCallback } from 'react'
import CollegeCard from '@/components/ui/CollegeCard'
import Link from 'next/link'

interface College {
  id: string; name: string; location: string; state: string
  fees: number; rating: number; type: string
  placements?: { avgPackage: number; placementRate: number } | null
  _count?: { reviews: number }
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [compareIds, setCompareIds] = useState<string[]>([])

  const [filters, setFilters] = useState({
    search: '', type: '', state: '', sortBy: 'rating'
  })

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ ...filters, page: String(page), limit: '6' })
    const res = await fetch(`/api/colleges?${params}`)
    const data = await res.json()
    setColleges(data.colleges || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }, [filters, page])

  useEffect(() => { fetchColleges() }, [fetchColleges])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) { alert('Max 3 colleges for comparison'); return prev }
      return [...prev, id]
    })
  }

  const types = ['Engineering', 'Medical', 'Arts', 'Management']
  const states = ['Maharashtra', 'Delhi', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Karnataka']

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Colleges</h1>
        <p className="text-gray-500">Discover {total} colleges across India</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Search colleges, cities..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.state} onChange={e => handleFilterChange('state', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="rating">Sort: Rating</option>
            <option value="fees">Sort: Fees</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Compare Bar */}
      {compareIds.length > 0 && (
        <div className="bg-blue-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="font-medium">{compareIds.length} college{compareIds.length > 1 ? 's' : ''} selected for comparison</span>
          <div className="flex gap-3">
            <button onClick={() => setCompareIds([])} className="text-blue-200 hover:text-white text-sm">Clear</button>
            {compareIds.length >= 2 && (
              <Link href={`/compare?ids=${compareIds.join(',')}`}
                className="bg-white text-blue-600 font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                Compare Now →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border h-72 animate-pulse">
              <div className="bg-gray-200 h-24 rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="bg-gray-200 h-5 rounded w-3/4" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 h-14 rounded-lg" />
                  <div className="bg-gray-100 h-14 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">No colleges found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map(c => (
            <CollegeCard key={c.id} college={c} compareIds={compareIds} onCompareToggle={toggleCompare} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            ← Prev
          </button>
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
