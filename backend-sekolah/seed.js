const sequelize = require('./config/database');
require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('✓ Semua tabel berhasil dibuat');

    const { User, Admin } = require('./models');

    const adminUser = await User.create({
      username: 'admin',
      password: 'password123',
      role: 'admin'
    });

    await Admin.create({ userId: adminUser.id, name: 'Administrator' });
    console.log('✓ Seeding selesai, admin id:', adminUser.id);

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Seeding gagal:', err.message);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
