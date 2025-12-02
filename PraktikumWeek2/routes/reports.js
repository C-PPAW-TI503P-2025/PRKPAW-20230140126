const express = require('express');
const router = express.Router();
 	const reportController = require('../controllers/reportController');
 	const { authenticateToken: addUserData, isAdmin } = require('../middleware/authMiddleware');
 	router.get('/daily', [addUserData, isAdmin], reportController.getDailyReport);
 	module.exports = router;
