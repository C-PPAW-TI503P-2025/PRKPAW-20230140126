// File: controllers/presensiController.js
const { Presensi, User } = require("../models");
const { Op } = require("sequelize"); // <--- WAJIB TAMBAH INI (Operator Sequelize)

// =======================
// CHECK-IN
// =======================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;
    const buktiFoto = req.file ? req.file.path : null; 


    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Lokasi tidak ditemukan" });
    }

    // Hitung awal hari ini (jam 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hitung akhir hari ini (jam 23:59:59)
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Cek apakah user sudah pernah check-in di antara jam 00:00 s/d 23:59 hari ini
    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: {
          [Op.between]: [today, endOfToday] // <--- PAKAI INI YANG BENAR
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini!" });
    }

    
    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude,
      buktiFoto: buktiFoto // Simpan path foto
    });



    return res.status(200).json({
      message: "Check-in berhasil",
      data: newRecord
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error server", error: error.message });
  }
};


// =======================
// CHECK-OUT
// =======================
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    // Cari yang checkIn hari ini tapi checkOut-nya masih kosong
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const presensi = await Presensi.findOne({
      where: { 
        userId, 
        checkIn: { [Op.gte]: today }, // Cari yang checkin hari ini
        checkOut: null // Dan checkoutnya masih kosong
      }
    });

    if (!presensi) {
      return res.status(400).json({ message: "Belum check-in atau sudah check-out hari ini" });
    }

    presensi.checkOut = new Date();
    await presensi.save();

    return res.status(200).json({
      message: "Check-out berhasil",
      data: presensi
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });



// =======================
// GET ALL (REPORT PRESENSI)
// =======================
exports.GetAll = async (req, res) => {
  try {
    const data = await Presensi.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"] // Pastikan kolom 'nama' ada di tabel Users
        }
      ],
      order: [['checkIn', 'DESC']] // Urutkan dari yang terbaru
    });

    res.status(200).json({
      message: "Success",
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};