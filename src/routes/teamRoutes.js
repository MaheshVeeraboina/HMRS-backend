// src/routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const teamCtrl = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', teamCtrl.listTeams);
router.post('/', teamCtrl.createTeam);
router.get('/:id', teamCtrl.getTeam);
router.put('/:id', teamCtrl.updateTeam);
router.delete('/:id', teamCtrl.deleteTeam);

// assignment endpoints
router.post('/:id/assign', teamCtrl.assignEmployee);    // body: { employeeId }
router.post('/:id/unassign', teamCtrl.unassignEmployee); // body: { employeeId }

module.exports = router;
