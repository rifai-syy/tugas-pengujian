// config/database.js
const { Sequelize } = require('sequelize');

// Format: new Sequelize('nama_database', 'username', 'password', { options })
const sequelize = new Sequelize('siakad_sekolah_orm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Ubah ke console.log jika ingin melihat raw SQL yang di-generate
});

// Tes koneksi
sequelize.authenticate()
    .then(() => console.log('Koneksi Sequelize berhasil.'))
    .catch(err => console.error('Tidak dapat terkoneksi ke database:', err));

module.exports = sequelize;