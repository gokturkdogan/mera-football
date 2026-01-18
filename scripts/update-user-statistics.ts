import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserStatistics() {
  console.log('Starting to update user statistics...')

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  })

  console.log(`Found ${users.length} users`)

  // Update each user's statistics
  for (const user of users) {
    // Count total matches
    const totalMatches = await prisma.matchRoster.count({
      where: {
        userId: user.id,
      },
    })

    // Count total goals
    const totalGoals = await prisma.matchGoal.count({
      where: {
        userId: user.id,
      },
    })

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalMatches,
        totalGoals,
      },
    })

    console.log(`Updated user ${user.id}: ${totalMatches} matches, ${totalGoals} goals`)
  }

  console.log('Finished updating user statistics!')
}

updateUserStatistics()
  .catch((e) => {
    console.error('Error updating user statistics:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
