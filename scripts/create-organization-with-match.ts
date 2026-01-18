import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const turkishNames = [
  'Ahmet Yılmaz', 'Mehmet Demir', 'Ali Kaya', 'Mustafa Şahin', 'Hasan Özkan',
  'Hüseyin Çelik', 'İbrahim Arslan', 'Osman Doğan', 'Fatih Aydın', 'Emre Kılıç',
  'Burak Yıldız', 'Can Özdemir', 'Kerem Avcı', 'Onur Güneş', 'Serkan Koç',
  'Tolga Aslan', 'Uğur Yüksel', 'Volkan Erdem', 'Yasin Karaca', 'Zeki Öztürk',
  'Murat Çetin', 'Okan Yıldırım', 'Cem Özkan', 'Deniz Kaya', 'Barış Şen',
  'Eren Demir', 'Kaan Yılmaz', 'Arda Özdemir', 'Berk Aydın', 'Caner Kılıç'
]

const turkishEmails = [
  'ahmet.yilmaz@example.com', 'mehmet.demir@example.com', 'ali.kaya@example.com',
  'mustafa.sahin@example.com', 'hasan.ozkan@example.com', 'huseyin.celik@example.com',
  'ibrahim.arslan@example.com', 'osman.dogan@example.com', 'fatih.aydin@example.com',
  'emre.kilic@example.com', 'burak.yildiz@example.com', 'can.ozdemir@example.com',
  'kerem.avci@example.com', 'onur.gunes@example.com', 'serkan.koc@example.com',
  'tolga.aslan@example.com', 'ugur.yuksel@example.com', 'volkan.erdem@example.com',
  'yasin.karaca@example.com', 'zeki.ozturk@example.com',
  'murat.cetin@example.com', 'okan.yildirim@example.com', 'cem.ozkan@example.com',
  'deniz.kaya@example.com', 'baris.sen@example.com', 'eren.demir@example.com',
  'kaan.yilmaz@example.com', 'arda.ozdemir@example.com', 'berk.aydin@example.com',
  'caner.kilic@example.com'
]

const adminNames = [
  'Yusuf Yıldız', 'Kemal Özkan', 'Selim Demir', 'Tuncay Kaya', 'Erkan Şahin'
]

const adminEmails = [
  'yusuf.yildiz@example.com', 'kemal.ozkan@example.com', 'selim.demir@example.com',
  'tuncay.kaya@example.com', 'erkan.sahin@example.com'
]

const organizationNames = [
  'Yeşil Sahalar FC', 'Şampiyonlar Kulübü', 'Golcüler Takımı', 'Futbol Severler', 'Halı Saha Liderleri',
  'Maç Tutkunları', 'Sahada Buluşanlar', 'Futbol Ailesi', 'Yeşil Çimenler', 'Gol Kralları'
]

const facilityNames = [
  'Merkez Halı Saha', 'Şehir Stadyumu', 'Spor Kompleksi', 'Futbol Akademisi', 'Yeşil Sahalar',
  'Şampiyonlar Saha', 'Golcüler Tesis', 'Futbol Merkezi', 'Spor Salonu', 'Arena Halı Saha'
]

const addresses = [
  'Kadıköy, İstanbul', 'Beşiktaş, İstanbul', 'Şişli, İstanbul', 'Beyoğlu, İstanbul', 'Üsküdar, İstanbul',
  'Ataşehir, İstanbul', 'Maltepe, İstanbul', 'Kartal, İstanbul', 'Pendik, İstanbul', 'Tuzla, İstanbul'
]

const positions = ['KALECI', 'DEFANS', 'ORTASAHA', 'FORVET']
const strongFeet = ['SOL', 'SAĞ', 'İKİSİ']
const phones = [
  '0532 123 4567', '0533 234 5678', '0534 345 6789', '0535 456 7890',
  '0536 567 8901', '0537 678 9012', '0538 789 0123', '0539 890 1234',
  '0541 901 2345', '0542 012 3456', '0543 123 4567', '0544 234 5678',
  '0545 345 6789', '0546 456 7890', '0547 567 8901', '0548 678 9012',
  '0549 789 0123', '0550 890 1234', '0551 901 2345', '0552 012 3456'
]

async function main() {
  console.log('Creating organization with match...\n')
  console.log('='.repeat(60))

  const hashedPassword = await bcrypt.hash('gokturk53', 10)

  // 1. Create Admin User
  const adminIndex = Math.floor(Math.random() * adminNames.length)
  const adminName = adminNames[adminIndex]
  const adminEmail = adminEmails[adminIndex]

  console.log('\n1. Creating admin user...')
  let admin
  try {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        phone: phones[adminIndex],
        role: 'ADMIN',
        plan: 'FREE',
        showPhone: true,
        showPosition: true,
        showStrongFoot: true,
        showHeight: true,
        showWeight: true,
        showAge: true,
      },
    })
    console.log(`✓ Admin created: ${adminName} (${adminEmail})`)
  } catch (error: any) {
    if (error.code === 'P2002') {
      admin = await prisma.user.findUnique({ where: { email: adminEmail } })
      console.log(`⚠ Admin already exists: ${adminEmail}, using existing...`)
    } else {
      throw error
    }
  }

  // 2. Create Organization
  const orgName = organizationNames[Math.floor(Math.random() * organizationNames.length)]
  console.log('\n2. Creating organization...')
  const organization = await prisma.organization.create({
    data: {
      name: orgName,
      description: `${orgName} - Düzenli maçlar yapan aktif bir futbol organizasyonu`,
      ownerId: admin!.id,
    },
  })
  console.log(`✓ Organization created: ${organization.name}`)

  // 3. Create Facilities (2-3 facilities)
  const facilityCount = Math.floor(Math.random() * 2) + 2 // 2 or 3
  console.log(`\n3. Creating ${facilityCount} facilities...`)
  const facilities = []
  for (let i = 0; i < facilityCount; i++) {
    const facilityName = facilityNames[Math.floor(Math.random() * facilityNames.length)]
    const address = addresses[Math.floor(Math.random() * addresses.length)]
    const price = Math.floor(Math.random() * 500) + 200 // 200-700 TL
    const isIndoor = Math.random() > 0.5
    const fieldType = Math.random() > 0.5 ? 'SYNTHETIC_GRASS' : 'REAL_GRASS'
    const lat = (Math.random() * 0.1 + 41.0).toFixed(6)
    const lng = (Math.random() * 0.1 + 28.9).toFixed(6)
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`

    const facility = await prisma.facility.create({
      data: {
        name: facilityName,
        location: googleMapsLink,
        matchPrice: price,
        isIndoor,
        fieldType,
        organizationId: organization.id,
      },
    })
    facilities.push(facility)
    console.log(`✓ Facility created: ${facilityName} (${address}) - ${price}₺, ${isIndoor ? 'Indoor' : 'Outdoor'}, ${fieldType}`)
  }

  // 4. Create 14 Players and add to organization
  console.log('\n4. Creating 14 players and adding to organization...')
  const players = []
  let playerIndex = 0

  for (let i = 0; i < 14; i++) {
    // Find unused name/email
    while (playerIndex < turkishNames.length && await prisma.user.findUnique({ where: { email: turkishEmails[playerIndex] } })) {
      playerIndex++
    }
    
    if (playerIndex >= turkishNames.length) {
      // Generate unique email if we run out
      const uniqueEmail = `player${Date.now()}-${i}@example.com`
      const uniqueName = `Player ${i + 1}`
      
      const phone = Math.random() > 0.5 ? phones[i % phones.length] : null
      const position = Math.random() > 0.5 ? positions[Math.floor(Math.random() * positions.length)] : null
      const strongFoot = Math.random() > 0.5 ? strongFeet[Math.floor(Math.random() * strongFeet.length)] : null
      const height = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 165 : null
      const weight = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 65 : null
      const age = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 18 : null

      const player = await prisma.user.create({
        data: {
          email: uniqueEmail,
          password: hashedPassword,
          name: uniqueName,
          phone,
          position,
          strongFoot,
          height,
          weight,
          age,
          showPhone: Math.random() > 0.5,
          showPosition: Math.random() > 0.5,
          showStrongFoot: Math.random() > 0.5,
          showHeight: Math.random() > 0.5,
          showWeight: Math.random() > 0.5,
          showAge: Math.random() > 0.5,
          role: 'PLAYER',
        },
      })

      await prisma.organizationMember.create({
        data: {
          userId: player.id,
          organizationId: organization.id,
          role: 'PLAYER',
          status: 'APPROVED',
        },
      })

      players.push(player)
      console.log(`✓ Player created and added: ${uniqueName}`)
      continue
    }

    const name = turkishNames[playerIndex]
    const email = turkishEmails[playerIndex]
    const phone = Math.random() > 0.5 ? phones[playerIndex % phones.length] : null
    const position = Math.random() > 0.5 ? positions[Math.floor(Math.random() * positions.length)] : null
    const strongFoot = Math.random() > 0.5 ? strongFeet[Math.floor(Math.random() * strongFeet.length)] : null
    const height = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 165 : null
    const weight = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 65 : null
    const age = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 18 : null

    try {
      const player = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          position,
          strongFoot,
          height,
          weight,
          age,
          showPhone: Math.random() > 0.5,
          showPosition: Math.random() > 0.5,
          showStrongFoot: Math.random() > 0.5,
          showHeight: Math.random() > 0.5,
          showWeight: Math.random() > 0.5,
          showAge: Math.random() > 0.5,
          role: 'PLAYER',
        },
      })

      await prisma.organizationMember.create({
        data: {
          userId: player.id,
          organizationId: organization.id,
          role: 'PLAYER',
          status: 'APPROVED',
        },
      })

      players.push(player)
      console.log(`✓ Player created and added: ${name}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠ Player already exists: ${email}, skipping...`)
        playerIndex++
        i-- // Retry with next player
        continue
      } else {
        throw error
      }
    }
    playerIndex++
  }

  // 5. Create Match (FINISHED status)
  console.log('\n5. Creating finished match...')
  const matchDate = new Date()
  matchDate.setDate(matchDate.getDate() - 7) // 7 days ago

  const selectedFacility = facilities[Math.floor(Math.random() * facilities.length)]
  const match = await prisma.match.create({
    data: {
      organizationId: organization.id,
      date: matchDate,
      time: '20:00',
      venue: selectedFacility.name,
      capacity: 10,
      status: 'FINISHED',
    },
  })
  console.log(`✓ Match created: ${matchDate.toLocaleDateString('tr-TR')} at ${selectedFacility.name}`)

  // 6. Add players to match roster (split into two teams)
  console.log('\n6. Adding players to match roster...')
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)
  const team1Players = shuffledPlayers.slice(0, Math.floor(players.length / 2))
  const team2Players = shuffledPlayers.slice(Math.floor(players.length / 2))

  for (let i = 0; i < team1Players.length; i++) {
    await prisma.matchRoster.create({
      data: {
        matchId: match.id,
        userId: team1Players[i].id,
        position: i < 5 ? ['GK', 'DEF', 'DEF', 'MID', 'MID'][i] : 'SUB',
      },
    })
  }

  for (let i = 0; i < team2Players.length; i++) {
    await prisma.matchRoster.create({
      data: {
        matchId: match.id,
        userId: team2Players[i].id,
        position: i < 5 ? ['GK', 'DEF', 'DEF', 'MID', 'MID'][i] : 'SUB',
      },
    })
  }
  console.log(`✓ ${team1Players.length} players added to Team A, ${team2Players.length} players added to Team B`)

  // 7. Create Scoreboard (goals)
  console.log('\n7. Creating scoreboard with goals...')
  const teamAScore = Math.floor(Math.random() * 5) + 3 // 3-7 goals
  const teamBScore = Math.floor(Math.random() * 5) + 2 // 2-6 goals

  await prisma.matchScore.create({
    data: {
      matchId: match.id,
      teamAScore,
      teamBScore,
    },
  })

  // Add random goals
  const goalScorers = shuffledPlayers.slice(0, Math.min(teamAScore + teamBScore, players.length))
  let goalIndex = 0

  for (let i = 0; i < teamAScore; i++) {
    const scorer = goalScorers[goalIndex % goalScorers.length]
    await prisma.matchGoal.create({
      data: {
        matchId: match.id,
        userId: scorer.id,
        team: 'A',
        minute: Math.floor(Math.random() * 90) + 1,
      },
    })
    goalIndex++
  }

  for (let i = 0; i < teamBScore; i++) {
    const scorer = goalScorers[goalIndex % goalScorers.length]
    await prisma.matchGoal.create({
      data: {
        matchId: match.id,
        userId: scorer.id,
        team: 'B',
        minute: Math.floor(Math.random() * 90) + 1,
      },
    })
    goalIndex++
  }
  console.log(`✓ Scoreboard created: Team A ${teamAScore} - ${teamBScore} Team B`)

  // 8. Create Match Ratings
  console.log('\n8. Creating match ratings...')
  let ratingCount = 0
  for (const rater of players) {
    // Each player rates 3-5 random players
    const playersToRate = shuffledPlayers
      .filter(p => p.id !== rater.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 3)

    for (const ratedPlayer of playersToRate) {
      const rating = Math.floor(Math.random() * 2) + 4 // 4-5 stars
      await prisma.matchRating.create({
        data: {
          matchId: match.id,
          raterId: rater.id,
          ratedUserId: ratedPlayer.id,
          rating,
        },
      })
      ratingCount++
    }
  }
  console.log(`✓ ${ratingCount} ratings created`)

  // Update match status to PUBLISHED
  await prisma.match.update({
    where: { id: match.id },
    data: { status: 'PUBLISHED' },
  })

  console.log('\n' + '='.repeat(60))
  console.log('\n✅ SUCCESS! Organization with match created:')
  console.log(`\n📋 Summary:`)
  console.log(`   Admin: ${adminName} (${adminEmail})`)
  console.log(`   Organization: ${organization.name}`)
  console.log(`   Facilities: ${facilities.length}`)
  console.log(`   Players: ${players.length}`)
  console.log(`   Match: Team A ${teamAScore} - ${teamBScore} Team B`)
  console.log(`   Ratings: ${ratingCount}`)
  console.log(`\n🔑 All users use password: gokturk53`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
