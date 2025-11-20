import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get list of players who accepted the match (for admin roster management)
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

    // Check if match exists and user is owner
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
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
        { error: 'Only organization owner can view attendance list' },
        { status: 403 }
      )
    }

    // Get all organization members who accepted the match
    const attendances = await prisma.matchAttendance.findMany({
      where: {
        matchId: params.id,
        status: 'ACCEPTED',
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
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Also get organization members who haven't responded yet (for display)
    // Include owner even if they're not a member
    const allMembers = await prisma.organizationMember.findMany({
      where: {
        organizationId: match.organizationId,
        status: 'APPROVED',
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

    // Get owner user
    const ownerUser = await prisma.user.findUnique({
      where: { id: match.organization.ownerId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    // Add owner to members list if not already there
    if (ownerUser && !allMembers.some(m => m.userId === ownerUser.id)) {
      allMembers.push({
        id: `owner-${ownerUser.id}`,
        userId: ownerUser.id,
        organizationId: match.organizationId,
        role: 'ADMIN' as any,
        status: 'APPROVED',
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: ownerUser,
      })
    }

    // Get all attendance statuses
    const allAttendances = await prisma.matchAttendance.findMany({
      where: {
        matchId: params.id,
      },
    })

    // Map members with their attendance status
    const membersWithAttendance = allMembers.map((member) => {
      const attendance = allAttendances.find(a => a.userId === member.userId)
      // Owner is always considered ACCEPTED
      if (member.userId === match.organization.ownerId) {
        return {
          ...member,
          attendanceStatus: 'ACCEPTED' as const,
        }
      }
      return {
        ...member,
        attendanceStatus: attendance?.status || 'PENDING',
      }
    })

    const acceptedPlayerIds = new Set(attendances.map(a => a.userId))
    const acceptedPlayers = attendances.map(a => a.user)
    
    // Add owner if not already in accepted list
    if (ownerUser && !acceptedPlayerIds.has(ownerUser.id)) {
      acceptedPlayers.push(ownerUser)
    }

    return NextResponse.json({ 
      acceptedPlayers,
      allMembers: membersWithAttendance,
    })
  } catch (error) {
    console.error('Get attendance list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

