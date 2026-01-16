import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createOrganizationSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
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
                  plan: true,
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

      // Get all organization IDs
      const organizationIds = memberships.map(m => m.organization.id)

      // Get all matches for these organizations
      const allMatches = await prisma.match.findMany({
        where: {
          organizationId: {
            in: organizationIds,
          },
          status: {
            in: ['DRAFT', 'UPCOMING'],
          },
        },
        select: {
          id: true,
          organizationId: true,
        },
      })

      // Get all attendances for these matches and user
      const matchIds = allMatches.map(m => m.id)
      const attendances = await prisma.matchAttendance.findMany({
        where: {
          matchId: {
            in: matchIds,
          },
          userId: payload.userId,
        },
        select: {
          matchId: true,
          status: true,
        },
      })

      // Create a map of matchId -> attendance status
      const attendanceMap = new Map(
        attendances.map(a => [a.matchId, a.status])
      )

      // Group matches by organization and count pending
      const pendingCountByOrg = new Map<string, number>()
      allMatches.forEach(match => {
        const attendance = attendanceMap.get(match.id)
        // If no attendance record or status is PENDING, it's pending
        if (!attendance || attendance === 'PENDING') {
          pendingCountByOrg.set(
            match.organizationId,
            (pendingCountByOrg.get(match.organizationId) || 0) + 1
          )
        }
      })

      // Add pending count to each organization
      const organizationsWithPendingMatches = memberships.map((m) => ({
        ...m.organization,
        pendingMatchAttendanceCount: pendingCountByOrg.get(m.organization.id) || 0,
      }))

      return NextResponse.json({
        organizations: organizationsWithPendingMatches,
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
              plan: true,
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
          members: {
            where: {
              status: 'PENDING',
            },
            select: {
              id: true,
            },
          },
        },
      })

      // Calculate unique members across all organizations
      const allMembers = await prisma.organizationMember.findMany({
        where: {
          organizationId: {
            in: organizations.map(org => org.id)
          },
          status: 'APPROVED',
        },
        select: {
          userId: true,
        },
      })

      // Get unique user IDs
      const uniqueUserIds = new Set(allMembers.map(member => member.userId))
      const uniqueMemberCount = uniqueUserIds.size

      const organizationsWithPending = organizations.map((org) => ({
        ...org,
        pendingRequestsCount: org.members?.length || 0,
      }))

      return NextResponse.json({ 
        organizations: organizationsWithPending,
        uniqueMemberCount 
      })
    }
  } catch (error) {
    console.error('Get organizations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


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

    // Check organization limit (max 3 for all admins)
    const existingOrganizations = await prisma.organization.count({
      where: {
        ownerId: payload.userId,
      },
    })

    if (existingOrganizations >= 3) {
      return NextResponse.json(
        { error: 'Maksimum 3 organizasyon oluşturabilirsiniz' },
        { status: 400 }
      )
    }

    // Get admin's plan
    const admin = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { plan: true },
    })

    const adminPlan = admin?.plan || 'FREE'

    const organization = await prisma.organization.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        avatarUrl: validatedData.avatarUrl || null,
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

