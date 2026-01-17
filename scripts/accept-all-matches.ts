import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const organizationId = 'cmk16npji0001zug6b89nxf25'
  
  console.log('Fetching organization members and matches...')
  
  // Get all approved members of the organization
  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId,
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
  })

  console.log(`Found ${members.length} approved members`)

  // Get all matches of the organization
  const matches = await prisma.match.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      date: true,
      time: true,
      venue: true,
      status: true,
    },
  })

  console.log(`Found ${matches.length} matches`)

  if (matches.length === 0) {
    console.log('No matches found. Exiting...')
    return
  }

  let totalAccepted = 0
  let totalSkipped = 0

  // For each member, accept all matches
  for (const member of members) {
    console.log(`\nProcessing member: ${member.user.name} (${member.user.email})`)
    
    for (const match of matches) {
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
          // Update to ACCEPTED if not already
          if (existingAttendance.status !== 'ACCEPTED') {
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
            console.log(`  ✓ Updated attendance for match ${match.id} (${new Date(match.date).toLocaleDateString('tr-TR')} ${match.time})`)
            totalAccepted++
          } else {
            console.log(`  - Already accepted match ${match.id}`)
            totalSkipped++
          }
        } else {
          // Create new attendance
          await prisma.matchAttendance.create({
            data: {
              matchId: match.id,
              userId: member.userId,
              status: 'ACCEPTED',
            },
          })
          console.log(`  ✓ Created attendance for match ${match.id} (${new Date(match.date).toLocaleDateString('tr-TR')} ${match.time})`)
          totalAccepted++
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`  ⚠ Attendance already exists for match ${match.id}`)
          totalSkipped++
        } else {
          console.error(`  ✗ Error processing match ${match.id}:`, error.message)
        }
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`\nDone!`)
  console.log(`Total accepted/updated: ${totalAccepted}`)
  console.log(`Total skipped: ${totalSkipped}`)
  console.log(`Total members: ${members.length}`)
  console.log(`Total matches: ${matches.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
