const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'siakad_sekolah_orm',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('Koneksi Sequelize berhasil.'))
  .catch(err => console.error('Tidak dapat terkoneksi ke database:', err));

module.exports = sequelize;
