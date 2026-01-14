import { NextRequest, NextResponse } from 'next/server'
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

    // Kullanıcının email ve mevcut avatarUrl'ini al
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { email: true, avatarUrl: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Email'den dosya ismini oluştur (@ işaretinden önceki kısım)
    const emailPrefix = user.email.split('@')[0]
    let fileName = emailPrefix
    let publicId = `profile-photos/${fileName}`
    let shouldOverwrite = false

    // Eğer kullanıcının mevcut avatarUrl'i varsa ve Cloudinary URL'si ise, public_id'yi çıkar
    if (user.avatarUrl && user.avatarUrl.includes('cloudinary.com')) {
      try {
        // Cloudinary URL'den public_id'yi çıkar
        // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
        const urlParts = user.avatarUrl.split('/upload/')
        if (urlParts.length > 1) {
          const pathAfterUpload = urlParts[1]
          // Transformations ve public_id'yi ayır
          const parts = pathAfterUpload.split('/')
          // Son kısım public_id olabilir (format uzantısı olmadan)
          const lastPart = parts[parts.length - 1]
          const publicIdFromUrl = lastPart.split('.')[0] // Format uzantısını kaldır
          
          // Eğer profile-photos klasöründen ise, aynı public_id'yi kullan
          if (publicIdFromUrl.startsWith('profile-photos/')) {
            publicId = publicIdFromUrl
            fileName = publicIdFromUrl.replace('profile-photos/', '')
            shouldOverwrite = true
          } else if (pathAfterUpload.includes('profile-photos/')) {
            // URL'de profile-photos varsa, public_id'yi çıkar
            const match = pathAfterUpload.match(/profile-photos\/([^\/.]+)/)
            if (match && match[1]) {
              fileName = match[1]
              publicId = `profile-photos/${fileName}`
              shouldOverwrite = true
            }
          }
        }
      } catch (error) {
        console.error('Error parsing existing avatar URL:', error)
        // Hata olursa yeni dosya oluştur
      }
    }

    // Eğer overwrite yapılmayacaksa, aynı isimde dosya var mı kontrol et
    if (!shouldOverwrite) {
      let counter = 1
      while (true) {
        try {
          await cloudinary.api.resource(publicId)
          // Dosya varsa, yeni isim oluştur
          fileName = `${emailPrefix}_${counter}`
          publicId = `profile-photos/${fileName}`
          counter++
        } catch (error: any) {
          // Dosya yoksa (404 hatası), bu ismi kullanabiliriz
          const httpCode = error?.error?.http_code || error?.http_code || error?.statusCode
          if (httpCode === 404) {
            break
          }
          // Başka bir hata varsa fırlat
          console.error('Error checking existing file:', error)
          throw error
        }
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Base64'e çevir (Cloudinary için)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Cloudinary'e yükle (folder parametresi klasörü otomatik oluşturur)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'profile-photos',
          public_id: fileName, // Sadece dosya adı, folder zaten belirtilmiş
          overwrite: shouldOverwrite, // Mevcut görseli güncelle veya yeni oluştur
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
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
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

