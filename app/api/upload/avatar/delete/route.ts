import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
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

    // Kullanıcının mevcut avatarUrl'ini al
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { avatarUrl: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.avatarUrl || !user.avatarUrl.includes('cloudinary.com')) {
      return NextResponse.json(
        { error: 'No avatar to delete' },
        { status: 400 }
      )
    }

    // Cloudinary URL'den public_id'yi çıkar
    let publicId = ''
    try {
      const urlParts = user.avatarUrl.split('/upload/')
      if (urlParts.length > 1) {
        const pathAfterUpload = urlParts[1]
        const parts = pathAfterUpload.split('/')
        const lastPart = parts[parts.length - 1]
        const publicIdFromUrl = lastPart.split('.')[0]
        
        if (pathAfterUpload.includes('profile-photos/')) {
          const match = pathAfterUpload.match(/profile-photos\/([^\/.]+)/)
          if (match && match[1]) {
            publicId = `profile-photos/${match[1]}`
          } else {
            publicId = `profile-photos/${publicIdFromUrl}`
          }
        } else {
          publicId = publicIdFromUrl
        }
      }
    } catch (error) {
      console.error('Error parsing avatar URL:', error)
      return NextResponse.json(
        { error: 'Invalid avatar URL format' },
        { status: 400 }
      )
    }

    // Cloudinary'den görseli sil
    try {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
    } catch (error: any) {
      console.error('Error deleting from Cloudinary:', error)
      // Cloudinary'den silme hatası olsa bile database'den silelim
    }

    // Database'den avatarUrl'i sil
    await prisma.user.update({
      where: { id: payload.userId },
      data: { avatarUrl: null }
    })

    return NextResponse.json({ success: true, message: 'Avatar deleted successfully' })
  } catch (error: any) {
    console.error('Avatar delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete avatar' },
      { status: 500 }
    )
  }
}



