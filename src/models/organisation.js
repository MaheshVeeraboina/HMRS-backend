// src/models/organisation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organisation = sequelize.define('Organisation', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'organisations', timestamps: false });

module.exports = Organisation;
