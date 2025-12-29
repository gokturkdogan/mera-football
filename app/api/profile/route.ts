import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(2),
  avatarUrl: z.string().url().optional().nullable(), // Cloudinary URL
  phone: z.string().optional(),
  position: z.enum(['KALECI', 'DEFANS', 'ORTASAHA', 'FORVET']).optional().nullable(),
  strongFoot: z.enum(['SOL', 'SAĞ', 'İKİSİ']).optional().nullable(),
  height: z.number().int().min(100).max(250).optional().nullable(),
  weight: z.number().int().min(30).max(200).optional().nullable(),
  age: z.number().int().min(10).max(100).optional().nullable(),
  showPhone: z.boolean().optional(),
  showPosition: z.boolean().optional(),
  showStrongFoot: z.boolean().optional(),
  showHeight: z.boolean().optional(),
  showWeight: z.boolean().optional(),
  showAge: z.boolean().optional(),
})

// PATCH - Update profile
export async function PATCH(request: NextRequest) {
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
    const validatedData = updateProfileSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name: validatedData.name,
        avatarUrl: validatedData.avatarUrl ?? null,
        phone: validatedData.phone,
        position: validatedData.position ?? null,
        strongFoot: validatedData.strongFoot ?? null,
        height: validatedData.height ?? null,
        weight: validatedData.weight ?? null,
        age: validatedData.age ?? null,
        showPhone: validatedData.showPhone ?? false,
        showPosition: validatedData.showPosition ?? false,
        showStrongFoot: validatedData.showStrongFoot ?? false,
        showHeight: validatedData.showHeight ?? false,
        showWeight: validatedData.showWeight ?? false,
        showAge: validatedData.showAge ?? false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        position: true,
        strongFoot: true,
        height: true,
        weight: true,
        age: true,
        role: true,
        showPhone: true,
        showPosition: true,
        showStrongFoot: true,
        showHeight: true,
        showWeight: true,
        showAge: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

