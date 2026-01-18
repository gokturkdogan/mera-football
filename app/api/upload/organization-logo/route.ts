import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { verifyToken } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { plan: true }
    })

    if (user?.plan !== 'PREMIUM') {
      return NextResponse.json(
        { error: 'Premium plan required to upload custom logo' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'organization-logos'
    const publicId = formData.get('publicId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Dosya formatı kontrolü
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Base64'e çevir (Cloudinary için)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Cloudinary'e yükle
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: folder,
          public_id: publicId,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    const result = uploadResult as any

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (error: any) {
    console.error('Organization logo upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload logo' },
      { status: 500 }
    )
  }
}

