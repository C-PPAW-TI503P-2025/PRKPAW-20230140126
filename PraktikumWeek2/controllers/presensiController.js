// File: controllers/presensiController.js
const { Presensi, User } = require("../models");
const { Op } = require("sequelize"); 
const multer = require('multer');
const path = require('path');

// =======================
// KONFIGURASI MULTER
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.ext
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
// CHECK-IN
// =======================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;
    

    const buktiFoto = req.file ? req.file.path : null; 


    console.log("--------------------------------------------");
    console.log("DEBUG CHECK-IN USER:", userName);
    console.log("Lokasi:", latitude, longitude);
    console.log("File Foto:", req.file); 
    console.log("Path Foto:", buktiFoto); 
    console.log("--------------------------------------------");


    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Lokasi tidak ditemukan" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: {
          [Op.between]: [today, endOfToday]
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
      buktiFoto: buktiFoto 
    });

    return res.status(200).json({
      message: "Check-in berhasil",
      data: newRecord
    });

  } catch (error) {
    console.error("Error CheckIn:", error);
    return res.status(500).json({ message: "Error server", error: error.message });
  }
};


exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const presensi = await Presensi.findOne({
      where: { 
        userId, 
        checkIn: { [Op.gte]: today }, 
        checkOut: null 
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

exports.GetAll = async (req, res) => {
  try {
    const data = await Presensi.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"]
        }
      ],
      order: [['checkIn', 'DESC']]
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