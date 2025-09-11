#!/bin/bash

echo "🚀 Setting up IQUP Database..."
echo "================================"

# Install tsx if not already installed
echo "📦 Installing tsx for running TypeScript files..."
npm install tsx --save-dev

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

# Run database seed
echo "🌱 Seeding database with initial data..."
npm run db:seed

echo ""
echo "✅ Database setup completed!"
echo ""
echo "🔑 Login Credentials:"
echo "Email: admin@iqup.com"
echo "Password: admin123456"
echo "Role: HQ_ADMIN (Can create all MF/LC/TT accounts)"
echo ""
echo "🎯 Next steps:"
echo "1. npm run dev (Start development server)"
echo "2. Open http://localhost:3000"
echo "3. Login with the admin credentials above"
echo "4. Create your MF/LC/TT accounts from the admin panel"
echo ""
echo "📊 Database tools:"
echo "- npm run db:studio (Open Prisma Studio)"
echo "- npm run db:reset (Reset and reseed database)"
echo ""
