import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateAttendanceSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
})

// GET - Get user's attendance status for a match
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

    const attendance = await prisma.matchAttendance.findUnique({
      where: {
        matchId_userId: {
          matchId: params.id,
          userId: payload.userId,
        },
      },
    })

    return NextResponse.json({ 
      attendance: attendance || { status: 'PENDING' }
    })
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update attendance status
export async function POST(
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

    const body = await request.json()
    const { status } = updateAttendanceSchema.parse(body)

    // Check if match exists
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          include: {
            members: {
              where: {
                userId: payload.userId,
                status: 'APPROVED',
              },
            },
          },
        },
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Check if user is a member of the organization or is the owner
    const isMember = match.organization.members.length > 0
    const isOwner = match.organization.ownerId === payload.userId

    if (!isMember && !isOwner) {
      return NextResponse.json(
        { error: 'You must be a member of this organization to respond to match attendance' },
        { status: 403 }
      )
    }

    // Check if match is finished
    if (match.status === 'FINISHED' || match.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Cannot update attendance for finished matches' },
        { status: 400 }
      )
    }

    // Upsert attendance
    const attendance = await prisma.matchAttendance.upsert({
      where: {
        matchId_userId: {
          matchId: params.id,
          userId: payload.userId,
        },
      },
      update: {
        status,
      },
      create: {
        matchId: params.id,
        userId: payload.userId,
        status,
      },
    })

    return NextResponse.json({ attendance })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

