// models/Admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true }, // Foreign Key ke Users
  name: { type: DataTypes.STRING, allowNull: false },
  no_wa: { type: DataTypes.STRING },
  foto: { type: DataTypes.TEXT('long') }
}, { tableName: 'admins', timestamps: false });

module.exports = Admin;