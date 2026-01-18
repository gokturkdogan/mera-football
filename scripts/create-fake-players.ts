import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const turkishNames = [
  'Ahmet Yılmaz', 'Mehmet Demir', 'Ali Kaya', 'Mustafa Şahin', 'Hasan Özkan',
  'Hüseyin Çelik', 'İbrahim Arslan', 'Osman Doğan', 'Fatih Aydın', 'Emre Kılıç',
  'Burak Yıldız', 'Can Özdemir', 'Kerem Avcı', 'Onur Güneş', 'Serkan Koç',
  'Tolga Aslan', 'Uğur Yüksel', 'Volkan Erdem', 'Yasin Karaca', 'Zeki Öztürk'
]

const turkishEmails = [
  'ahmet.yilmaz@example.com', 'mehmet.demir@example.com', 'ali.kaya@example.com',
  'mustafa.sahin@example.com', 'hasan.ozkan@example.com', 'huseyin.celik@example.com',
  'ibrahim.arslan@example.com', 'osman.dogan@example.com', 'fatih.aydin@example.com',
  'emre.kilic@example.com', 'burak.yildiz@example.com', 'can.ozdemir@example.com',
  'kerem.avci@example.com', 'onur.gunes@example.com', 'serkan.koc@example.com',
  'tolga.aslan@example.com', 'ugur.yuksel@example.com', 'volkan.erdem@example.com',
  'yasin.karaca@example.com', 'zeki.ozturk@example.com'
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
  console.log('Creating 20 fake players...')
  console.log('\nEmail and password list:')
  console.log('='.repeat(50))

  const hashedPassword = await bcrypt.hash('gokturk53', 10)

  for (let i = 0; i < 20; i++) {
    const name = turkishNames[i]
    const email = turkishEmails[i]
    // Random phone (50% chance to have phone)
    const phone = Math.random() > 0.5 ? phones[i] : null
    // Random position (50% chance to have position)
    const position = Math.random() > 0.5 ? positions[Math.floor(Math.random() * positions.length)] : null
    // Random strongFoot (50% chance to have strongFoot)
    const strongFoot = Math.random() > 0.5 ? strongFeet[Math.floor(Math.random() * strongFeet.length)] : null
    // Random height (50% chance to have height)
    const height = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 165 : null // 165-195 cm
    // Random weight (50% chance to have weight)
    const weight = Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 65 : null // 65-95 kg
    // Random age (50% chance to have age)
    const age = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 18 : null // 18-38 years

    // Random show settings (50% chance for each)
    const showPhone = Math.random() > 0.5
    const showPosition = Math.random() > 0.5
    const showStrongFoot = Math.random() > 0.5
    const showHeight = Math.random() > 0.5
    const showWeight = Math.random() > 0.5
    const showAge = Math.random() > 0.5

    try {
      // Create user
      const user = await prisma.user.create({
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
          showPhone,
          showPosition,
          showStrongFoot,
          showHeight,
          showWeight,
          showAge,
          role: 'PLAYER',
        },
      })

      console.log(`✓ Created player: ${name}`)
      console.log(`  Email: ${email}`)
      console.log(`  Password: gokturk53`)
      console.log(`  Phone: ${phone || 'Not set'} (${showPhone ? 'Visible' : 'Hidden'})`)
      console.log(`  Position: ${position || 'Not set'} (${showPosition ? 'Visible' : 'Hidden'})`)
      console.log(`  Strong Foot: ${strongFoot || 'Not set'} (${showStrongFoot ? 'Visible' : 'Hidden'})`)
      console.log(`  Height: ${height ? height + ' cm' : 'Not set'} (${showHeight ? 'Visible' : 'Hidden'})`)
      console.log(`  Weight: ${weight ? weight + ' kg' : 'Not set'} (${showWeight ? 'Visible' : 'Hidden'})`)
      console.log(`  Age: ${age || 'Not set'} (${showAge ? 'Visible' : 'Hidden'})`)
      console.log('')
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠ User already exists: ${email}, skipping...`)
      } else {
        console.error(`✗ Error creating player ${name}:`, error.message)
      }
    }
  }

  console.log('='.repeat(50))
  console.log('\nDone! 20 fake players created.')
  console.log('\nAll players use password: gokturk53')
  console.log('\nEmail list:')
  turkishEmails.forEach((email, index) => {
    console.log(`${index + 1}. ${email}`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
