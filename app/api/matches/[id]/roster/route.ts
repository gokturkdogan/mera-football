import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Get match roster
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
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const roster = await prisma.matchRoster.findMany({
      where: { matchId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ roster })
  } catch (error) {
    console.error('Get roster error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add player to roster (admin only)
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

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can manage roster' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, position } = z.object({
      userId: z.string(),
      position: z.string().optional(),
    }).parse(body)

    // Check if match exists and user is owner
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
        roster: true,
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    if (match.organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can manage roster' },
        { status: 403 }
      )
    }

    // Check capacity
    if (match.roster.length >= match.capacity) {
      return NextResponse.json(
        { error: 'Match roster is full' },
        { status: 400 }
      )
    }

    // Check if user is already in roster
    const existingRoster = await prisma.matchRoster.findUnique({
      where: {
        matchId_userId: {
          matchId: params.id,
          userId,
        },
      },
    })

    if (existingRoster) {
      return NextResponse.json(
        { error: 'Player already in roster' },
        { status: 400 }
      )
    }

    // Check if user is member of organization
    const isMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: match.organizationId,
        },
        status: 'APPROVED',
      },
    })

    if (!isMember) {
      return NextResponse.json(
        { error: 'User is not a member of this organization' },
        { status: 400 }
      )
    }

    const rosterEntry = await prisma.matchRoster.create({
      data: {
        matchId: params.id,
        userId,
        position,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ roster: rosterEntry }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add to roster error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove player from roster (admin only)
export async function DELETE(
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

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can manage roster' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Check if match exists and user is owner
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

    if (match.organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can manage roster' },
        { status: 403 }
      )
    }

    await prisma.matchRoster.delete({
      where: {
        matchId_userId: {
          matchId: params.id,
          userId,
        },
      },
    })

    return NextResponse.json({ message: 'Player removed from roster' })
  } catch (error) {
    console.error('Remove from roster error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

