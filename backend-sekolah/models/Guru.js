// models/Guru.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guru = sequelize.define('Guru', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nip: { type: DataTypes.STRING, unique: true },
  nuptk: { type: DataTypes.STRING },
  pendidikan: { type: DataTypes.STRING },
  spesialisasi: { type: DataTypes.STRING },
  no_wa: { type: DataTypes.STRING },
  foto: { type: DataTypes.TEXT('long') }
}, { tableName: 'gurus', timestamps: false });

module.exports = Guru;