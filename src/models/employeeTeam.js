// src/models/employeeTeam.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  team_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  assigned_by: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'employee_teams',
  timestamps: false,
  indexes: [{ unique: true, fields: ['employee_id', 'team_id'] }]
});

module.exports = EmployeeTeam;
