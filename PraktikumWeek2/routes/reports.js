// File: routes/reports.js
const express = require('express');
const router = express.Router();

const presensiController = require('../controllers/presensiController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Route Get All Reports
router.get('/', authenticateToken, isAdmin, presensiController.GetAll);

module.exports = router;