import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const matchId = 'cmkjpf2kz001g5s02oul57l9z'

  console.log(`Accepting all players for match: ${matchId}\n`)
  console.log('='.repeat(60))

  // 1. Find match and organization
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      organization: {
        include: {
          members: {
            where: {
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
          },
        },
      },
    },
  })

  if (!match) {
    console.error('❌ Match not found!')
    process.exit(1)
  }

  console.log(`✓ Match found: ${match.organization.name}`)
  console.log(`✓ Organization members: ${match.organization.members.length}\n`)

  // 2. Accept attendance for all approved members
  let acceptedCount = 0
  let skippedCount = 0

  for (const member of match.organization.members) {
    try {
      // Check if attendance already exists
      const existingAttendance = await prisma.matchAttendance.findUnique({
        where: {
          matchId_userId: {
            matchId: match.id,
            userId: member.userId,
          },
        },
      })

      if (existingAttendance) {
        // Update existing attendance
        await prisma.matchAttendance.update({
          where: {
            matchId_userId: {
              matchId: match.id,
              userId: member.userId,
            },
          },
          data: {
            status: 'ACCEPTED',
          },
        })
        console.log(`✓ Updated: ${member.user.name} (${member.user.email})`)
      } else {
        // Create new attendance
        await prisma.matchAttendance.create({
          data: {
            matchId: match.id,
            userId: member.userId,
            status: 'ACCEPTED',
          },
        })
        console.log(`✓ Created: ${member.user.name} (${member.user.email})`)
      }
      acceptedCount++
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠ Already exists: ${member.user.name}, skipping...`)
        skippedCount++
      } else {
        console.error(`✗ Error for ${member.user.name}:`, error.message)
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ SUCCESS!`)
  console.log(`   Accepted: ${acceptedCount} players`)
  console.log(`   Skipped: ${skippedCount} players`)
  console.log(`   Total: ${match.organization.members.length} players`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
