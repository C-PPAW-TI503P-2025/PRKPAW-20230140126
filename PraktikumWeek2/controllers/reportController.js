const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    const whereClause = {};

    if (nama) {
      whereClause.nama = {
        [Op.like]: `%${nama}%`, 
      };
    }

    if (tanggalMulai && tanggalSelesai) {
      whereClause.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    }

    const records = await Presensi.findAll({ where: whereClause });

    res.status(200).json({
      message: "Laporan harian berhasil diambil.",
      filter: {
        nama: nama || null,
        tanggalMulai: tanggalMulai || null,
        tanggalSelesai: tanggalSelesai || null,
      },
      jumlahData: records.length,
      data: records,
    });
  } catch (error) {
    console.error("❌ Error Report:", error.message);
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
