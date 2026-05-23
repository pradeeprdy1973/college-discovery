import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ saved: false })
  const { searchParams } = new URL(req.url)
  const collegeId = searchParams.get('collegeId')
  if (!collegeId) return NextResponse.json({ saved: false })
  const exists = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId: session.user.id, collegeId } }
  })
  return NextResponse.json({ saved: !!exists })
}
