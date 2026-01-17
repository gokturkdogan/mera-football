import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateFacilitySchema = z.object({
  name: z.string().min(1, 'Tesis adı gereklidir').optional(),
  location: z.string().min(1, 'Konum gereklidir').refine(
    (value) => {
      // Sadece iframe HTML'i kontrolü
      return value.includes('<iframe') && value.includes('google.com/maps/embed')
    },
    'Geçerli bir Google Maps embed iframe HTML giriniz'
  ).optional(),
  matchPrice: z.number().min(0, 'Maç ücreti 0 veya pozitif olmalıdır').optional().nullable(),
  isIndoor: z.boolean().optional().nullable(),
  fieldType: z.enum(['REAL_GRASS', 'SYNTHETIC_GRASS']).optional().nullable(),
})

// GET - Get facility details
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

    const facility = await prisma.facility.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!facility) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ facility })
  } catch (error) {
    console.error('Get facility error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update facility (owner only)
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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const facility = await prisma.facility.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          include: {
            owner: true,
          },
        },
      },
    })

    if (!facility) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    // Check if user is the organization owner
    if (facility.organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can update facilities' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateFacilitySchema.parse(body)

    const updateData: any = {}
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.location) updateData.location = validatedData.location
    if (validatedData.matchPrice !== undefined) updateData.matchPrice = validatedData.matchPrice
    if (validatedData.isIndoor !== undefined) updateData.isIndoor = validatedData.isIndoor
    if (validatedData.fieldType !== undefined) updateData.fieldType = validatedData.fieldType

    const updatedFacility = await prisma.facility.update({
      where: { id: params.id },
      data: updateData,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ facility: updatedFacility })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Update facility error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete facility (owner only)
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

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if facility exists
    const facility = await prisma.facility.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          include: {
            owner: true,
          },
        },
      },
    })

    if (!facility) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    // Check if user is the organization owner
    if (facility.organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can delete facilities' },
        { status: 403 }
      )
    }

    // Check if there are matches at this facility
    const matchesAtFacility = await prisma.match.findMany({
      where: {
        organizationId: facility.organizationId,
        venue: facility.name,
      },
    })

    if (matchesAtFacility.length > 0) {
      const matchIds = matchesAtFacility.map(m => m.id)
      
      // Use transaction to ensure all related data is deleted
      await prisma.$transaction(async (tx) => {
        // Delete match rosters
        await tx.matchRoster.deleteMany({
          where: {
            matchId: {
              in: matchIds,
            },
          },
        })

        // Delete match scores
        await tx.matchScore.deleteMany({
          where: {
            matchId: {
              in: matchIds,
            },
          },
        })

        // Delete match ratings
        await tx.matchRating.deleteMany({
          where: {
            matchId: {
              in: matchIds,
            },
          },
        })

        // Delete match attendances
        await tx.matchAttendance.deleteMany({
          where: {
            matchId: {
              in: matchIds,
            },
          },
        })

        // Finally delete matches
        await tx.match.deleteMany({
          where: {
            id: {
              in: matchIds,
            },
          },
        })
      })
    }

    // Delete facility
    await prisma.facility.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ 
      message: 'Facility deleted successfully',
      deletedMatchesCount: matchesAtFacility.length 
    })
  } catch (error) {
    console.error('Delete facility error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}