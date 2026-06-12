// models/Kepsek.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kepsek = sequelize.define('Kepsek', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nip: { type: DataTypes.STRING, unique: true },
  no_wa: { type: DataTypes.STRING },
  foto: { type: DataTypes.TEXT('long') }
}, { tableName: 'kepseks', timestamps: false });

module.exports = Kepsek;