const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const { validationResult } = require("express-validator");

// ✅ GET semua data presensi
exports.GetAll = async (req, res) => {
  try {
    const data = await Presensi.findAll();
    res.json({
      message: "Berhasil mengambil semua data presensi",
      total: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

// ✅ POST manual (buat testing)
exports.CreatePresensi = async (req, res) => {
  try {
    const { userId, nama, checkIn, checkOut } = req.body;
    if (!userId || !nama || !checkIn)
      return res.status(400).json({ message: "userId, nama, dan checkIn wajib diisi" });

    const newData = await Presensi.create({
      userId,
      nama,
      checkIn,
      checkOut: checkOut || null
    });

    res.status(201).json({
      message: "Data presensi berhasil ditambahkan",
      data: newData
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan data", error: error.message });
  }
};

// ✅ CHECK-IN
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ✅ CHECK-OUT
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ✅ UPDATE (dengan validasi express-validator)
exports.UpdatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ✅ DELETE
exports.DeletePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    await recordToDelete.destroy();
    res.json({ message: "Data presensi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
