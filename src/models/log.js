// src/models/log.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Log = sequelize.define('Log', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.BIGINT.UNSIGNED },
  user_id: { type: DataTypes.BIGINT.UNSIGNED },
  action: { type: DataTypes.STRING(100), allowNull: false },
  details: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'logs', timestamps: false });

module.exports = Log;
