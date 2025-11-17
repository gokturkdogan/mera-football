import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Get match details
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

    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
        roster: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        scores: true,
        ratings: {
          include: {
            rater: {
              select: {
                id: true,
                name: true,
              },
            },
            ratedUser: {
              select: {
                id: true,
                name: true,
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

    // Check if user has access (member of organization)
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

    return NextResponse.json({ match })
  } catch (error) {
    console.error('Get match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update match (admin only)
export async function PATCH(
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
        { error: 'Only admins can update matches' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateSchema = z.object({
      date: z.string().optional(),
      time: z.string().optional(),
      venue: z.string().optional(),
      capacity: z.number().optional(),
      status: z.enum(['DRAFT', 'UPCOMING', 'FINISHED', 'PUBLISHED']).optional(),
    })

    const validatedData = updateSchema.parse(body)

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
        { error: 'Only organization owner can update matches' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (validatedData.date) updateData.date = new Date(validatedData.date)
    if (validatedData.time) updateData.time = validatedData.time
    if (validatedData.venue) updateData.venue = validatedData.venue
    if (validatedData.capacity) updateData.capacity = validatedData.capacity
    if (validatedData.status) updateData.status = validatedData.status

    const updatedMatch = await prisma.match.update({
      where: { id: params.id },
      data: updateData,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ match: updatedMatch })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

