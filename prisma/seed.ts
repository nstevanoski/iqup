import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Hash the default admin password
  const hashedPassword = await bcrypt.hash('admin123456', 12)

  // Create the main HQ account
  const hq = await prisma.hQ.upsert({
    where: { code: 'HQ001' },
    update: {},
    create: {
      name: 'IQUP Headquarters',
      code: 'HQ001',
      email: 'admin@iqup.com',
      phone: '+1-800-IQUP-HQ',
      address: '123 Education Street',
      city: 'Learning City',
      state: 'Knowledge State',
      country: 'Education Nation',
      postalCode: '12345',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Created HQ:', hq)

  // Create the main admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@iqup.com' },
    update: {},
    create: {
      email: 'admin@iqup.com',
      password: hashedPassword,
      firstName: 'IQUP',
      lastName: 'Administrator',
      phone: '+1-800-IQUP-ADMIN',
      role: 'HQ_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      hqId: hq.id,
    },
  })

  console.log('✅ Created Admin User:', {
    id: adminUser.id,
    email: adminUser.email,
    name: `${adminUser.firstName} ${adminUser.lastName}`,
    role: adminUser.role,
  })

  // Optional: Create a demo Master Franchisee and Learning Center
  const demoMF = await prisma.masterFranchisee.upsert({
    where: { code: 'MF001' },
    update: {},
    create: {
      name: 'Demo Master Franchisee',
      code: 'MF001',
      email: 'demo.mf@iqup.com',
      phone: '+1-800-DEMO-MF',
      address: '456 Franchise Avenue',
      city: 'Business City',
      state: 'Commerce State',
      country: 'Education Nation',
      postalCode: '23456',
      status: 'ACTIVE',
      hqId: hq.id,
    },
  })

  console.log('✅ Created Demo MF:', demoMF)

  // Create demo Learning Center under the MF
  const demoLC = await prisma.learningCenter.upsert({
    where: { code: 'LC001' },
    update: {},
    create: {
      name: 'Demo Learning Center',
      code: 'LC001',
      email: 'demo.lc@iqup.com',
      phone: '+1-800-DEMO-LC',
      address: '789 Learning Lane',
      city: 'Education City',
      state: 'Learning State',
      country: 'Education Nation',
      postalCode: '34567',
      status: 'ACTIVE',
      mfId: demoMF.id,
    },
  })

  console.log('✅ Created Demo LC:', demoLC)

  // Create demo Teacher Trainer under HQ
  const demoTT = await prisma.teacherTrainer.upsert({
    where: { code: 'TT001' },
    update: {},
    create: {
      name: 'Demo Teacher Trainer',
      code: 'TT001',
      email: 'demo.tt@iqup.com',
      phone: '+1-800-DEMO-TT',
      address: '321 Training Boulevard',
      city: 'Instructor City',
      state: 'Teaching State',
      country: 'Education Nation',
      postalCode: '45678',
      status: 'ACTIVE',
      hqId: hq.id,
    },
  })

  console.log('✅ Created Demo TT:', demoTT)

  // Create demo users for each account type
  const demoUsers = [
    {
      email: 'mf.admin@iqup.com',
      firstName: 'MF',
      lastName: 'Administrator',
      role: 'MF_ADMIN',
      accountId: demoMF.id,
      accountType: 'mf',
    },
    {
      email: 'lc.admin@iqup.com',
      firstName: 'LC',
      lastName: 'Administrator',
      role: 'LC_ADMIN',
      accountId: demoLC.id,
      accountType: 'lc',
    },
    {
      email: 'tt.admin@iqup.com',
      firstName: 'TT',
      lastName: 'Administrator',
      role: 'TT_ADMIN',
      accountId: demoTT.id,
      accountType: 'tt',
    },
  ]

  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPassword, // Same password for demo
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: '+1-800-DEMO-USER',
        role: userData.role as any,
        status: 'ACTIVE',
        emailVerified: true,
        ...(userData.accountType === 'mf' && { mfId: userData.accountId }),
        ...(userData.accountType === 'lc' && { lcId: userData.accountId }),
        ...(userData.accountType === 'tt' && { ttId: userData.accountId }),
      },
    })

    console.log(`✅ Created ${userData.role} User:`, {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    })
  }

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('┌─────────────────────────────────────────────────────────┐')
  console.log('│ MAIN ADMIN (Can create all accounts)                   │')
  console.log('│ Email: admin@iqup.com                                   │')
  console.log('│ Password: admin123456                                   │')
  console.log('│ Role: HQ_ADMIN                                          │')
  console.log('├─────────────────────────────────────────────────────────┤')
  console.log('│ DEMO ACCOUNTS (for testing)                            │')
  console.log('│ MF Admin: mf.admin@iqup.com / admin123456               │')
  console.log('│ LC Admin: lc.admin@iqup.com / admin123456               │')
  console.log('│ TT Admin: tt.admin@iqup.com / admin123456               │')
  console.log('└─────────────────────────────────────────────────────────┘')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
