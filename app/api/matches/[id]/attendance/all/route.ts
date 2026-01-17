import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Check if user is a member of the organization or is the owner
    const isMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: payload.userId,
          organizationId: match.organizationId,
        },
        status: 'APPROVED',
      },
    })

    const isOwner = match.organization.ownerId === payload.userId

    if (!isMember && !isOwner) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all attendances for this match
    const attendances = await prisma.matchAttendance.findMany({
      where: {
        matchId: params.id,
      },
      select: {
        userId: true,
        status: true,
      },
    })

    return NextResponse.json({ 
      attendances,
    })
  } catch (error) {
    console.error('Get all attendances error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
