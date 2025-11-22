// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

async function register(req, res) {
  const { orgName, adminName, email, password } = req.body;
  if (!orgName || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const [org] = await Organisation.findOrCreate({ where: { name: orgName }, defaults: { name: orgName } });

    // check user email
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User with this email already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ organisation_id: org.id, name: adminName || 'Admin', email, password_hash, role: 'admin' });

    await Log.create({ organisation_id: org.id, user_id: user.id, action: 'organisation_created', details: `Created org ${org.name}` });

    const token = jwt.sign({ userId: user.id, orgId: org.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, organisation_id: org.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, orgId: user.organisation_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    await Log.create({ organisation_id: user.organisation_id, user_id: user.id, action: 'user_logged_in', details: `User ${user.email} logged in` });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, organisation_id: user.organisation_id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function logout(req, res) {
  try {
    await Log.create({ organisation_id: req.organisation_id, user_id: req.user.id, action: 'user_logged_out', details: `User ${req.user.id} logged out` });
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, logout };
