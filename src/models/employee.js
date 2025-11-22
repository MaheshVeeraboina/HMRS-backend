// src/models/employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100) },
  email: { type: DataTypes.STRING(255) },
  phone: { type: DataTypes.STRING(50) },
  position: { type: DataTypes.STRING(100) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'employees', timestamps: false });

module.exports = Employee;
