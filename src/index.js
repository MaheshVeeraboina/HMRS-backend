// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const { sequelize: s, Organisation, User } = require('./models'); // ensure models are loaded
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const logRoutes = require('./routes/logRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "HRMS Backend Running",
    time: new Date().toISOString()
  });
});


// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);

// health


// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("DB disabled: running without database");

    // seed demo user/org if none
    const userCount = await User.count();
    if (userCount === 0) {
      const bcrypt = require('bcrypt');
      const pwd = await bcrypt.hash('admin123', 10);
      const org = await Organisation.create({ name: 'DemoOrg' });
      await User.create({ organisation_id: org.id, name: 'Demo Admin', email: 'admin@demo.com', password_hash: pwd, role: 'admin' });
      console.log('Seeded demo org + admin (admin@demo.com / admin123)');
    }

    app.listen(PORT, () => {
      console.log(`HRMS backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
})();
