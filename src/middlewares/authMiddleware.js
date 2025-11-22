// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(401).json({ error: 'Invalid token user' });

    // attach user + organisation info to request
    req.user = { id: user.id, role: user.role };
    req.organisation_id = user.organisation_id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
