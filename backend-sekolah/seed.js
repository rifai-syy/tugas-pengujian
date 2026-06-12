// seed.js - Jalankan sekali sebelum test untuk isi data awal
const sequelize = require('./config/database');
const User = require('./models/User');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // Sync semua tabel (force: true = hapus & buat ulang)
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    // Buat user admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✓ User admin dibuat, id:', adminUser.id);

    // Buat profil admin
    await Admin.create({
      userId: adminUser.id,
      name: 'Administrator'
    });
    console.log('✓ Profil admin dibuat');

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