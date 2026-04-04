const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = '123456';
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          fullName: 'Admin System',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin account seeded successfully');
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

module.exports = { seedAdmin };
