// src/controllers/employeeController.js
const { Employee, Team, Log } = require('../models');

async function listEmployees(req, res) {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.organisation_id },
      include: [{ model: Team, through: { attributes: [] } }]
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getEmployee(req, res) {
  try {
    const emp = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.organisation_id },
      include: [{ model: Team, through: { attributes: [] } }]
    });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createEmployee(req, res) {
  try {
    const emp = await Employee.create({ ...req.body, organisation_id: req.organisation_id });
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'employee_create', details: JSON.stringify({ employeeId: emp.id }) });
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateEmployee(req, res) {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, organisation_id: req.organisation_id } });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    await emp.update({ ...req.body, updated_at: new Date() });
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'employee_update', details: JSON.stringify({ employeeId: emp.id }) });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteEmployee(req, res) {
  try {
    const emp = await Employee.findOne({ where: { id: req.params.id, organisation_id: req.organisation_id } });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    await emp.destroy();
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'employee_delete', details: JSON.stringify({ employeeId: req.params.id }) });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
