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

    // Get statistics from User table
    const totalMatches = player.totalMatches || 0
    const totalGoals = player.totalGoals || 0

    // Get match history (last 10 matches)
    const matchHistory = await prisma.matchRoster.findMany({
      where: {
        userId: params.id,
      },
      include: {
        match: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
            scores: true,
            playerAverages: {
              where: {
                userId: params.id,
              },
            },
            goals: {
              where: {
                userId: params.id,
              },
            },
          },
        },
      },
      orderBy: {
        match: {
          date: 'desc',
        },
      },
      take: 10,
    })

    const formattedMatchHistory = matchHistory.map((mr) => ({
      id: mr.match.id,
      date: mr.match.date,
      time: mr.match.time,
      venue: mr.match.venue,
      status: mr.match.status,
      organization: {
        id: mr.match.organization.id,
        name: mr.match.organization.name,
      },
      scores: mr.match.scores ? {
        teamAScore: mr.match.scores.teamAScore,
        teamBScore: mr.match.scores.teamBScore,
      } : null,
      averageRating: mr.match.playerAverages.length > 0 ? mr.match.playerAverages[0].averageRating : null,
      goalsCount: mr.match.goals.length,
    }))

    return NextResponse.json({
      player: {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        avatarUrl: player.avatarUrl,
        position: player.position,
        strongFoot: player.strongFoot,
        height: player.height,
        weight: player.weight,
        age: player.age,
        showPhone: player.showPhone,
        showPosition: player.showPosition,
        showStrongFoot: player.showStrongFoot,
        showHeight: player.showHeight,
        showWeight: player.showWeight,
        showAge: player.showAge,
        role: player.role,
        plan: player.plan,
        averageRating: player.averageRating,
        createdAt: player.createdAt,
        organizations,
        statistics: {
          totalMatches,
          totalGoals,
        },
        matchHistory: formattedMatchHistory,
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

