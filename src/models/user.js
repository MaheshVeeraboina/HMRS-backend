// src/models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(255) },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.STRING(50), defaultValue: 'admin' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'users', timestamps: false });

module.exports = User;
