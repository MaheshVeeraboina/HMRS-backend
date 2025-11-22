// src/controllers/teamController.js
const { Team, Employee, EmployeeTeam, Log } = require('../models');

async function listTeams(req, res) {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.organisation_id },
      include: [{ model: Employee, through: { attributes: [] } }]
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTeam(req, res) {
  try {
    const team = await Team.findOne({
      where: { id: req.params.id, organisation_id: req.organisation_id },
      include: [{ model: Employee, through: { attributes: [] } }]
    });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTeam(req, res) {
  try {
    const team = await Team.create({ ...req.body, organisation_id: req.organisation_id });
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'team_create', details: JSON.stringify({ teamId: team.id }) });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTeam(req, res) {
  try {
    const team = await Team.findOne({ where: { id: req.params.id, organisation_id: req.organisation_id } });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    await team.update({ ...req.body, updated_at: new Date() });
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'team_update', details: JSON.stringify({ teamId: team.id }) });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTeam(req, res) {
  try {
    const team = await Team.findOne({ where: { id: req.params.id, organisation_id: req.organisation_id } });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    await team.destroy();
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'team_delete', details: JSON.stringify({ teamId: req.params.id }) });
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function assignEmployee(req, res) {
  try {
    const teamId = req.params.id;
    const { employeeId } = req.body;

    const team = await Team.findOne({ where: { id: teamId, organisation_id: req.organisation_id } });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const employee = await Employee.findOne({ where: { id: employeeId, organisation_id: req.organisation_id } });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const [assignment, created] = await EmployeeTeam.findOrCreate({
      where: { employee_id: employeeId, team_id: teamId },
      defaults: { assigned_by: req.user.id }
    });

    if (!created) return res.status(200).json({ message: 'Already assigned' });

    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'employee_assigned', details: JSON.stringify({ employeeId, teamId }) });

    res.json({ message: 'Assigned', assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function unassignEmployee(req, res) {
  try {
    const teamId = req.params.id;
    const { employeeId } = req.body;

    const deleted = await EmployeeTeam.destroy({ where: { employee_id: employeeId, team_id: teamId } });
    if (!deleted) return res.status(404).json({ error: 'Assignment not found' });

    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'employee_unassigned', details: JSON.stringify({ employeeId, teamId }) });

    res.json({ message: 'Unassigned' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listTeams, getTeam, createTeam, updateTeam, deleteTeam, assignEmployee, unassignEmployee };
