'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import CollegeCard from '@/components/ui/CollegeCard'
import Link from 'next/link'

interface College {
  id: string; name: string; location: string; state: string
  fees: number; rating: number; type: string
  placements?: { avgPackage: number; placementRate: number } | null
}

export default function SavedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return }
    if (status === 'authenticated') {
      fetch('/api/saved').then(r => r.json()).then(d => { setColleges(d); setLoading(false) })
    }
  }, [status, router])

  if (status === 'loading' || loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl h-64 animate-pulse border" />)}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Saved Colleges</h1>
        <p className="text-gray-500">{colleges.length} college{colleges.length !== 1 ? 's' : ''} saved</p>
      </div>

      {colleges.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">🔖</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No saved colleges yet</h2>
          <p className="text-gray-400 mb-8">Browse colleges and click the bookmark icon to save them here</p>
          <Link href="/colleges" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
            Explore Colleges →
          </Link>
        </div>
      ) : (
        <>
          {colleges.length >= 2 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <p className="text-blue-700 text-sm font-medium">Want to compare your saved colleges?</p>
              <Link href={`/compare?ids=${colleges.slice(0, 3).map(c => c.id).join(',')}`}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                Compare Top 3
              </Link>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map(c => <CollegeCard key={c.id} college={c} />)}
          </div>
        </>
      )}
    </div>
  )
}
