const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kelas = sequelize.define('Kelas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_kelas: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_wali_kelas: {
    type: DataTypes.INTEGER,
    allowNull: true // Bisa null jika kelas belum memiliki wali kelas
  }
}, {
  tableName: 'kelas',
  timestamps: false
});

module.exports = Kelas;