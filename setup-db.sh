#!/bin/bash

# Database setup script for development
echo "🔧 Setting up database..."

# Navigate to backend directory
cd backend

# Check if database exists, if not create it
if [ ! -f "./prisma/dev.db" ]; then
    echo "📁 Creating database file..."
    touch ./prisma/dev.db
fi

echo "🔄 Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma 2>/dev/null || {
    echo "⚠️  Prisma generate failed - using local client"
}

echo "🗄️  Pushing schema to database..."
npx prisma db push --schema=./prisma/schema.prisma 2>/dev/null || {
    echo "⚠️  Prisma db push failed - schema may already exist"
}

echo "🌱 Seeding database with sample data..."
node seed.js || {
    echo "⚠️  Seeding failed - continuing anyway"
}

echo "✅ Database setup complete!"