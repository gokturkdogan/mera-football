import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Get all players in the system
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

    // Get all players and admins (users with role PLAYER or ADMIN)
    // Admins can also be added to matches as players
    const players = await prisma.user.findMany({
      where: {
        role: {
          in: ['PLAYER', 'ADMIN'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        position: true,
        strongFoot: true,
        height: true,
        weight: true,
        age: true,
        showPhone: true,
        showPosition: true,
        showStrongFoot: true,
        showHeight: true,
        showWeight: true,
        showAge: true,
        role: true,
        averageRating: true,
        createdAt: true,
        _count: {
          select: {
            organizations: {
              where: {
                status: 'APPROVED',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ players })
  } catch (error) {
    console.error('Get players error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

