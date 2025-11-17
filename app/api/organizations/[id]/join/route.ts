import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Join organization (player only)
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

    if (!payload || payload.role !== 'PLAYER') {
      return NextResponse.json(
        { error: 'Only players can join organizations' },
        { status: 403 }
      )
    }

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      include: {
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

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Check if already a member
    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: payload.userId,
          organizationId: params.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'Already a member of this organization' },
        { status: 400 }
      )
    }

    // Check player's organization count (max 2)
    const playerOrganizations = await prisma.organizationMember.count({
      where: {
        userId: payload.userId,
        status: 'APPROVED',
      },
    })

    if (playerOrganizations >= 2) {
      return NextResponse.json(
        { error: 'You can only join a maximum of 2 organizations' },
        { status: 400 }
      )
    }

    // Check organization capacity (for FREE plan)
    if (
      organization.plan === 'FREE' &&
      organization._count.members >= organization.maxPlayers
    ) {
      return NextResponse.json(
        { error: 'Organization has reached maximum capacity' },
        { status: 400 }
      )
    }

    // Create membership request
    const membership = await prisma.organizationMember.create({
      data: {
        userId: payload.userId,
        organizationId: params.id,
        role: 'PLAYER',
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ membership }, { status: 201 })
  } catch (error) {
    console.error('Join organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

