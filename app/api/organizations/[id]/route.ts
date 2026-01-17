import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
})

// GET - Get organization details
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

    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
                showPhone: true,
                position: true,
                strongFoot: true,
                height: true,
                weight: true,
                age: true,
                showPosition: true,
                showStrongFoot: true,
                showHeight: true,
                showWeight: true,
                showAge: true,
              },
            },
          },
        },
        matches: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
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
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Organization details are now public - all authenticated users can view
    // Check if user is member or owner for additional actions
    const isMember = organization.members.some(
      (m) => m.userId === payload.userId
    )
    const isOwner = organization.ownerId === payload.userId

    return NextResponse.json({ 
      organization,
      userAccess: {
        isMember,
        isOwner,
      }
    })
  } catch (error) {
    console.error('Get organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update organization (owner only)
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

    // Check if user is the owner
    if (organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can update the organization' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateOrganizationSchema.parse(body)

    const updatedOrganization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && { description: validatedData.description || null }),
        ...(validatedData.avatarUrl !== undefined && { avatarUrl: validatedData.avatarUrl || null }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
                showPhone: true,
                position: true,
                strongFoot: true,
                height: true,
                weight: true,
                age: true,
                showPosition: true,
                showStrongFoot: true,
                showHeight: true,
                showWeight: true,
                showAge: true,
              },
            },
          },
        },
        matches: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
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
    })

    return NextResponse.json({ organization: updatedOrganization })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete organization (owner only)
export async function DELETE(
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
        { error: 'Only admins can delete organizations' },
        { status: 403 }
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

    // Check if user is the owner
    if (organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can delete the organization' },
        { status: 403 }
      )
    }

    // Delete organization (cascade will handle related records)
    await prisma.organization.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: 'Organization deleted successfully' })
  } catch (error) {
    console.error('Delete organization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}