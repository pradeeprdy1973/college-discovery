import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const state = searchParams.get('state') || ''
    const minFees = parseInt(searchParams.get('minFees') || '0')
    const maxFees = parseInt(searchParams.get('maxFees') || '9999999')
    const sortBy = searchParams.get('sortBy') || 'rating'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { state: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(type && { type }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
      fees: { gte: minFees, lte: maxFees },
    }

    const orderBy = sortBy === 'fees' ? { fees: 'asc' as const }
      : sortBy === 'name' ? { name: 'asc' as const }
      : { rating: 'desc' as const }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where, orderBy, skip, take: limit,
        include: { placements: true, _count: { select: { reviews: true } } }
      }),
      prisma.college.count({ where })
    ])

    return NextResponse.json({ colleges, total, pages: Math.ceil(total / limit), page })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
