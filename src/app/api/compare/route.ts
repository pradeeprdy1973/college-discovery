import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []
    if (ids.length < 2) return NextResponse.json({ error: 'Need at least 2 college IDs' }, { status: 400 })
    if (ids.length > 3) return NextResponse.json({ error: 'Max 3 colleges' }, { status: 400 })
    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: { courses: true, placements: true, reviews: true }
    })
    return NextResponse.json(colleges)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
