const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PenugasanGuru = sequelize.define('PenugasanGuru', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_kelas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_guru: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_mapel: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'penugasan_guru',
  timestamps: false
});

module.exports = PenugasanGuru;