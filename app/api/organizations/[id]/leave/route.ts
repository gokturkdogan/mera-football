import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Leave organization
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

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Cannot leave if owner
    if (organization.ownerId === payload.userId) {
      return NextResponse.json(
        { error: 'Organization owner cannot leave. Transfer ownership first.' },
        { status: 400 }
      )
    }

    // Delete membership
    await prisma.organizationMember.delete({
      where: {
        userId_organizationId: {
          userId: payload.userId,
          organizationId: params.id,
        },
      },
    })

    return NextResponse.json({ message: 'Left organization successfully' })
  } catch (error) {
    console.error('Leave organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

