// src/routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logCtrl = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', logCtrl.listLogs);

module.exports = router;
