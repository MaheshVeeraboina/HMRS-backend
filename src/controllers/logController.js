// src/controllers/logController.js
const { Log } = require('../models');
const { Op } = require('sequelize');

async function listLogs(req, res) {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const where = { organisation_id: req.organisation_id };
    const { action, userId, from, to, limit } = req.query;

    if (action) where.action = { [Op.like]: `%${action}%` };
    if (userId) where.user_id = userId;
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at[Op.gte] = new Date(from);
      if (to) where.created_at[Op.lte] = new Date(to);
    }

    const logs = await Log.findAll({ where, order: [['created_at', 'DESC']], limit: limit ? parseInt(limit) : 200 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listLogs };
