const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken: authMiddleware } = require("../middleware/authMiddleware");



router.post("/check-in", authMiddleware, presensiController.CheckIn);
router.post("/check-out", authMiddleware, presensiController.CheckOut);
router.get("/", authMiddleware, presensiController.GetAll);

module.exports = router;
