// src/models/team.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Team = sequelize.define('Team', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'teams', timestamps: false });

module.exports = Team;
