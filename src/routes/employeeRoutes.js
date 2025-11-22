// src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const emp = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', emp.listEmployees);
router.post('/', emp.createEmployee);
router.get('/:id', emp.getEmployee);
router.put('/:id', emp.updateEmployee);
router.delete('/:id', emp.deleteEmployee);

module.exports = router;
