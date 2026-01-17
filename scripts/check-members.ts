import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const organizationId = 'cmk16npji0001zug6b89nxf25'
  
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
    orderBy: {
      createdAt: 'asc',
    },
  })

  console.log(`Total APPROVED members: ${members.length}`)
  console.log('\nMembers list:')
  members.forEach((member, index) => {
    console.log(`${index + 1}. ${member.user.name} (${member.user.email}) - Status: ${member.status}`)
  })

  const allMembers = await prisma.organizationMember.findMany({
    where: {
      organizationId,
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

  console.log(`\nTotal ALL members: ${allMembers.length}`)
  console.log('\nAll members by status:')
  const byStatus = allMembers.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  console.log(byStatus)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
