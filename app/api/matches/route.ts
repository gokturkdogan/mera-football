import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createMatchSchema = z.object({
  organizationId: z.string(),
  date: z.string(),
  time: z.string(),
  venue: z.string(),
  capacity: z.number().min(2),
})

// GET - List matches
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const status = searchParams.get('status')

    const where: any = {}
    if (organizationId) {
      where.organizationId = organizationId
    }
    if (status) {
      where.status = status
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        roster: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        scores: true,
        _count: {
          select: {
            roster: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Get matches error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create match (admin only)
export async function POST(request: NextRequest) {
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
        { error: 'Only admins can create matches' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createMatchSchema.parse(body)

    // Check if organization exists and user is owner
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    if (organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can create matches' },
        { status: 403 }
      )
    }

    // Check FREE plan limits (max 1 match per week)
    if (organization.plan === 'FREE') {
      const matchDate = new Date(validatedData.date)
      const weekStart = new Date(matchDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const matchesThisWeek = await prisma.match.count({
        where: {
          organizationId: validatedData.organizationId,
          date: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
      })

      if (matchesThisWeek >= 1) {
        return NextResponse.json(
          { error: 'FREE plan allows maximum 1 match per week' },
          { status: 400 }
        )
      }
    }

    const match = await prisma.match.create({
      data: {
        organizationId: validatedData.organizationId,
        date: new Date(validatedData.date),
        time: validatedData.time,
        venue: validatedData.venue,
        capacity: validatedData.capacity,
        status: 'DRAFT',
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ match }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

