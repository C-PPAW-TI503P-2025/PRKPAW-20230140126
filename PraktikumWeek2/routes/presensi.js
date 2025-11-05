const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');

router.use(addUserData);

// ✅ CRUD ROUTES
router.get('/', presensiController.GetAll);
router.post('/', presensiController.CreatePresensi);

// ✅ PRESENSI ACTIONS
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// ✅ UPDATE dengan validasi format tanggal
router.put('/:id', [
  body('checkIn').isISO8601().withMessage('Format checkIn tidak valid (gunakan format ISO 8601)'),
  body('checkOut').isISO8601().withMessage('Format checkOut tidak valid (gunakan format ISO 8601)')
], presensiController.UpdatePresensi);

// ✅ DELETE
router.delete('/:id', presensiController.DeletePresensi);

module.exports = router;
