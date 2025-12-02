// controllers/presensiController.js
const { Presensi, User } = require("../models");

// =======================
// CHECK-IN
// =======================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Lokasi tidak ditemukan" });
    }

    // Cek jika sudah pernah check-in hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: { $gte: today }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini" });
    }

    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude
    });

    return res.status(200).json({
      message: "Check-in berhasil",
      data: newRecord
    });

  } catch (error) {
    return res.status(500).json({ message: "Error server", error: error.message });
  }
};


// =======================
// CHECK-OUT
// =======================
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const presensi = await Presensi.findOne({
      where: { userId, checkOut: null }
    });

    if (!presensi) {
      return res.status(400).json({ message: "Belum check-in" });
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
          attributes: ["id", "username", "email"]
        }
      ]
    });

    res.status(200).json({
      message: "Success",
      data
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
