// models/Siswa.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Siswa = sequelize.define('Siswa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nisn: { type: DataTypes.STRING, unique: true },
  id_kelas: { type: DataTypes.INTEGER },
  status_siswa: { type: DataTypes.ENUM('Aktif', 'Lulus', 'Keluar'), defaultValue: 'Aktif' },
  alamat: { type: DataTypes.TEXT },
  no_wa: { type: DataTypes.STRING },
  foto: { type: DataTypes.TEXT('long') }
}, { tableName: 'siswas', timestamps: false });

module.exports = Siswa;