import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
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

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check user's current role from database (not from token, as role may have changed)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true },
    })

    if (!user || user.role !== 'PLAYER') {
      return NextResponse.json(
        { error: 'Sadece oyuncular organizasyonlara katılabilir' },
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

    // Note: Organization capacity check is done when admin approves the request
    // This allows admins to manage their members (remove/add) as needed

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

