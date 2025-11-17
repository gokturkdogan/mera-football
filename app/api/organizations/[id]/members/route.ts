import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Get organization members (with pending requests)
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

    // Check if user has access
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const isOwner = organization.ownerId === payload.userId
    const isMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: payload.userId,
          organizationId: params.id,
        },
      },
    })

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all members (approved and pending)
    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { joinedAt: 'desc' },
      ],
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Approve/Reject member request (admin only)
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

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { memberId, status } = z.object({
      memberId: z.string(),
      status: z.enum(['APPROVED', 'REJECTED']),
    }).parse(body)

    // Check if user is owner
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
    })

    if (!organization || organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can approve/reject members' },
        { status: 403 }
      )
    }

    // Check organization capacity if approving
    if (status === 'APPROVED') {
      const currentCount = await prisma.organizationMember.count({
        where: {
          organizationId: params.id,
          status: 'APPROVED',
        },
      })

      if (
        organization.plan === 'FREE' &&
        currentCount >= organization.maxPlayers
      ) {
        return NextResponse.json(
          { error: 'Organization has reached maximum capacity' },
          { status: 400 }
        )
      }
    }

    // Update member status
    const member = await prisma.organizationMember.update({
      where: {
        id: memberId,
      },
      data: {
        status,
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

    return NextResponse.json({ member })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update member status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

