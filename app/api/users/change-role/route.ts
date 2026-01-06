import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { newRole } = await request.json()

    if (!newRole || (newRole !== 'ADMIN' && newRole !== 'PLAYER')) {
      return NextResponse.json(
        { error: 'Geçersiz rol' },
        { status: 400 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Aynı role geçmeye çalışıyorsa hata döndür
    if (currentUser.role === newRole) {
      return NextResponse.json(
        { error: 'Zaten bu roldesiniz' },
        { status: 400 }
      )
    }

    // Transaction içinde rol değiştirme ve ilgili verileri silme
    await prisma.$transaction(async (tx) => {
      if (currentUser.role === 'ADMIN' && newRole === 'PLAYER') {
        // Yönetici -> Oyuncu: Tüm organizasyonları ve ilişkili verileri sil
        
        // Önce kullanıcının sahip olduğu organizasyonları bul
        const userOrganizations = await tx.organization.findMany({
          where: { ownerId: payload.userId },
          select: { id: true },
        })

        const organizationIds = userOrganizations.map(org => org.id)

        if (organizationIds.length > 0) {
          // Her organizasyon için ilişkili verileri sil
          for (const orgId of organizationIds) {
            // Organizasyona ait tesisleri bul
            const facilities = await tx.facility.findMany({
              where: { organizationId: orgId },
              select: { id: true },
            })

            const facilityIds = facilities.map(f => f.id)

            // Her tesis için maç verilerini sil
            for (const facilityId of facilityIds) {
              const facility = await tx.facility.findUnique({
                where: { id: facilityId },
                select: { name: true },
              })

              if (facility) {
                // Bu tesiste oynanan maçları bul
                const matches = await tx.match.findMany({
                  where: { venue: facility.name },
                  select: { id: true },
                })

                const matchIds = matches.map(m => m.id)

                // Maç verilerini sil
                for (const matchId of matchIds) {
                  await tx.matchRoster.deleteMany({ where: { matchId } })
                  await tx.matchScore.deleteMany({ where: { matchId } })
                  await tx.matchRating.deleteMany({ where: { matchId } })
                  await tx.matchAttendance.deleteMany({ where: { matchId } })
                }

                // Maçları sil
                await tx.match.deleteMany({ where: { venue: facility.name } })
              }
            }

            // Tesisleri sil
            await tx.facility.deleteMany({ where: { organizationId: orgId } })

            // Organizasyon üyeliklerini sil
            await tx.organizationMember.deleteMany({ where: { organizationId: orgId } })
          }

          // Organizasyonları sil
          await tx.organization.deleteMany({ where: { ownerId: payload.userId } })
        }
      } else if (currentUser.role === 'PLAYER' && newRole === 'ADMIN') {
        // Oyuncu -> Yönetici: Tüm organizasyon üyeliklerini sil
        await tx.organizationMember.deleteMany({
          where: { userId: payload.userId },
        })
      }

      // Rolü güncelle
      await tx.user.update({
        where: { id: payload.userId },
        data: { role: newRole },
      })
    })

    return NextResponse.json(
      { message: 'Rol başarıyla değiştirildi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Change role error:', error)
    return NextResponse.json(
      { error: 'Rol değiştirme sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}

