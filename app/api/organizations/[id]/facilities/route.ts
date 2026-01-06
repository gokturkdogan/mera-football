import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFacilitySchema = z.object({
  name: z.string().min(1, 'Tesis adı gereklidir'),
  location: z.string().min(1, 'Konum gereklidir').refine(
    (value) => {
      // Sadece iframe HTML'i kontrolü
      return value.includes('<iframe') && value.includes('google.com/maps/embed')
    },
    'Geçerli bir Google Maps embed iframe HTML giriniz'
  ),
  matchPrice: z.number().min(0, 'Maç ücreti 0 veya pozitif olmalıdır').optional().nullable(),
  isIndoor: z.boolean().optional().nullable(),
  fieldType: z.enum(['REAL_GRASS', 'SYNTHETIC_GRASS']).optional().nullable(),
})

// GET - Get all facilities for an organization
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

    const facilities = await prisma.facility.findMany({
      where: {
        organizationId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ facilities })
  } catch (error) {
    console.error('Get facilities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new facility
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

    // Check if organization exists and user is owner
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
      include: { owner: true },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    if (organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can add facilities' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createFacilitySchema.parse(body)

    const facility = await prisma.facility.create({
      data: {
        name: validatedData.name,
        location: validatedData.location,
        matchPrice: validatedData.matchPrice ?? null,
        isIndoor: validatedData.isIndoor ?? null,
        fieldType: validatedData.fieldType ?? null,
        organizationId: params.id,
      },
    })

    return NextResponse.json({ facility }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Create facility error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

