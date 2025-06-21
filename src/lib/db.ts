import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database utility functions
export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Failed to disconnect from database:', error);
  }
}

// Database seeding utilities
export async function createDefaultProfile() {
  const existingProfile = await prisma.profile.findFirst();
  if (existingProfile) return existingProfile;

  return await prisma.profile.create({
    data: {
      name: 'Your Name',
      about: 'Tell us about yourself...',
      headline: 'Full Stack Developer',
      availability: 'available', // Use enum value, not label
    },
  });
}

export async function createDefaultContactInfo() {
  const existingContact = await prisma.contactInfo.findFirst();
  if (existingContact) return existingContact;

  return await prisma.contactInfo.create({
    data: {
      email: 'your.email@example.com',
    },
  });
}

export async function createDefaultUser() {
  const bcrypt = await import('bcryptjs');
  const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'password123';

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) return existingUser;

  const password_hash = await bcrypt.hash(password, 12);

  return await prisma.user.create({
    data: {
      username,
      password_hash,
    },
  });
}

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    await createDefaultUser();
    await createDefaultProfile();
    await createDefaultContactInfo();

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

export default prisma;
