import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const player = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        organizations: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Format organizations
    const organizations = player.organizations.map((om) => ({
      id: om.organization.id,
      name: om.organization.name,
      role: om.role,
      status: om.status,
    }))

    return NextResponse.json({
      player: {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        role: player.role,
        plan: player.plan,
        createdAt: player.createdAt,
        organizations,
      },
    })
  } catch (error) {
    console.error('Get player error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

