'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CollegeFinder</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/colleges" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Colleges</Link>
            <Link href="/compare" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Compare</Link>
            {session && <Link href="/saved" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Saved</Link>}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hi, {session.user.name?.split(' ')[0]}</span>
                <button onClick={() => signOut()} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                <Link href="/auth/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/colleges" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Colleges</Link>
            <Link href="/compare" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Compare</Link>
            {session && <Link href="/saved" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Saved</Link>}
            {session ? (
              <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 text-red-600">Sign Out</button>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 text-gray-600">Login</Link>
                <Link href="/auth/register" className="block px-3 py-2 text-blue-600 font-medium">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
