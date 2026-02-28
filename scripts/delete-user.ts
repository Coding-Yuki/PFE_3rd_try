import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    // Delete user with email "test@gmail.com"
    const deletedUser = await prisma.user.deleteMany({
      where: {
        email: 'test@gmail.com'
      }
    });

    if (deletedUser.count > 0) {
      console.log('✅ User deleted successfully');
      console.log(`Deleted ${deletedUser.count} user(s) with email "test@gmail.com"`);
    } else {
      console.log('❌ No user found with email "test@gmail.com"');
    }

  } catch (error) {
    console.error('❌ Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
