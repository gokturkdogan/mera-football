import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ratingSchema = z.object({
  ratedUserId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// GET - Get match ratings
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

    const ratings = await prisma.matchRating.findMany({
      where: { matchId: params.id },
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
    })

    return NextResponse.json({ ratings })
  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create rating
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
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = ratingSchema.parse(body)

    // Check if match exists and is finished
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        roster: true,
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    if (match.status !== 'FINISHED' && match.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Can only rate finished matches' },
        { status: 400 }
      )
    }

    // Check if rater is in roster
    const isInRoster = match.roster.some((r) => r.userId === payload.userId)
    if (!isInRoster) {
      return NextResponse.json(
        { error: 'You must be in match roster to rate' },
        { status: 403 }
      )
    }

    // Check if rated user is in roster
    const isRatedInRoster = match.roster.some(
      (r) => r.userId === validatedData.ratedUserId
    )
    if (!isRatedInRoster) {
      return NextResponse.json(
        { error: 'Rated user must be in match roster' },
        { status: 400 }
      )
    }

    // Cannot rate yourself
    if (payload.userId === validatedData.ratedUserId) {
      return NextResponse.json(
        { error: 'Cannot rate yourself' },
        { status: 400 }
      )
    }

    // Check if already rated
    const existingRating = await prisma.matchRating.findUnique({
      where: {
        matchId_raterId_ratedUserId: {
          matchId: params.id,
          raterId: payload.userId,
          ratedUserId: validatedData.ratedUserId,
        },
      },
    })

    if (existingRating) {
      // Update existing rating
      const rating = await prisma.matchRating.update({
        where: { id: existingRating.id },
        data: {
          rating: validatedData.rating,
          comment: validatedData.comment,
        },
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
      })

      return NextResponse.json({ rating })
    }

    // Create new rating
    const rating = await prisma.matchRating.create({
      data: {
        matchId: params.id,
        raterId: payload.userId,
        ratedUserId: validatedData.ratedUserId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
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
    })

    return NextResponse.json({ rating }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create rating error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

