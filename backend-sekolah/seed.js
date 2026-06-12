// seed.js - Jalankan sekali sebelum test untuk isi data awal
const sequelize = require('./config/database');
const User = require('./models/User');
const Admin = require('./models/Admin');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    const adminUser = await User.create({
      username: 'admin',
      password: 'password123',
      role: 'admin'
    });
    console.log('✓ User admin dibuat, id:', adminUser.id);

    await Admin.create({
      userId: adminUser.id,
      name: 'Administrator'
    });
    console.log('✓ Seeding selesai');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding gagal:', err.message);
    await sequelize.close();
    process.exit(1);
  }
}

seed();