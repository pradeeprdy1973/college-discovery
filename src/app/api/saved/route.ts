import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: { college: { include: { placements: true } } }
  })
  return NextResponse.json(saved.map(s => s.college))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { collegeId } = await req.json()
  const exists = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId: session.user.id, collegeId } }
  })
  if (exists) {
    await prisma.savedCollege.delete({ where: { id: exists.id } })
    return NextResponse.json({ saved: false })
  }
  await prisma.savedCollege.create({ data: { userId: session.user.id, collegeId } })
  return NextResponse.json({ saved: true })
}
