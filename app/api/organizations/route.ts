import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createOrganizationSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  plan: z.enum(['FREE', 'PREMIUM']).default('FREE'),
})

// GET - List organizations (for player: their organizations, for admin: all their organizations)
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

    if (payload.role === 'PLAYER') {
      // Get player's organizations
      const memberships = await prisma.organizationMember.findMany({
        where: {
          userId: payload.userId,
          status: 'APPROVED',
        },
        include: {
          organization: {
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              _count: {
                select: {
                  members: {
                    where: {
                      status: 'APPROVED',
                    },
                  },
                },
              },
            },
          },
        },
      })

      return NextResponse.json({
        organizations: memberships.map((m) => m.organization),
      })
    } else {
      // Get admin's organizations
      const organizations = await prisma.organization.findMany({
        where: {
          ownerId: payload.userId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: {
                where: {
                  status: 'APPROVED',
                },
              },
            },
          },
        },
      })

      return NextResponse.json({ organizations })
    }
  } catch (error) {
    console.error('Get organizations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create organization (admin only)
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
        { error: 'Only admins can create organizations' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createOrganizationSchema.parse(body)

    // Check plan limits
    const maxPlayers = validatedData.plan === 'FREE' ? 10 : 999999

    const organization = await prisma.organization.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        plan: validatedData.plan,
        maxPlayers,
        ownerId: payload.userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Auto-approve owner as member
    await prisma.organizationMember.create({
      data: {
        userId: payload.userId,
        organizationId: organization.id,
        role: 'ADMIN',
        status: 'APPROVED',
      },
    })

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

