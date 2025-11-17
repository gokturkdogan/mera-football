import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const scoreSchema = z.object({
  teamAScore: z.number().min(0),
  teamBScore: z.number().min(0),
  teamAGoals: z.array(z.object({
    userId: z.string(),
    minute: z.number(),
  })).optional(),
  teamBGoals: z.array(z.object({
    userId: z.string(),
    minute: z.number(),
  })).optional(),
})

// GET - Get match score
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

    const score = await prisma.matchScore.findUnique({
      where: { matchId: params.id },
    })

    return NextResponse.json({ score })
  } catch (error) {
    console.error('Get score error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create/Update match score (admin only)
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

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can enter scores' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = scoreSchema.parse(body)

    // Check if match exists and user is owner
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
        roster: true,
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    if (match.organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can enter scores' },
        { status: 403 }
      )
    }

    // Validate goal scorers are in roster
    const rosterUserIds = match.roster.map((r) => r.userId)
    const allGoalUserIds = [
      ...(validatedData.teamAGoals || []).map((g) => g.userId),
      ...(validatedData.teamBGoals || []).map((g) => g.userId),
    ]

    for (const userId of allGoalUserIds) {
      if (!rosterUserIds.includes(userId)) {
        return NextResponse.json(
          { error: `User ${userId} is not in match roster` },
          { status: 400 }
        )
      }
    }

    // Create or update score
    const score = await prisma.matchScore.upsert({
      where: { matchId: params.id },
      update: {
        teamAScore: validatedData.teamAScore,
        teamBScore: validatedData.teamBScore,
        teamAGoals: validatedData.teamAGoals || [],
        teamBGoals: validatedData.teamBGoals || [],
      },
      create: {
        matchId: params.id,
        teamAScore: validatedData.teamAScore,
        teamBScore: validatedData.teamBScore,
        teamAGoals: validatedData.teamAGoals || [],
        teamBGoals: validatedData.teamBGoals || [],
      },
    })

    // Update match status to FINISHED
    await prisma.match.update({
      where: { id: params.id },
      data: { status: 'FINISHED' },
    })

    return NextResponse.json({ score })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create score error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

