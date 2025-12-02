const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { userId, tanggalMulai, tanggalSelesai } = req.query;

    const whereClause = {};

    // Filter userId
    if (userId) {
      whereClause.userId = userId;
    }

    // Filter tanggal
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(tanggalMulai);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(tanggalSelesai);
      endDate.setHours(23, 59, 59, 999);

      whereClause.checkIn = {
        [Op.between]: [startDate, endDate],
      };
    }

    const records = await Presensi.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"]
        }
      ]
    });

    res.status(200).json({
      message: "Laporan berhasil diambil",
      filter: {
        userId: userId || null,
        tanggalMulai: tanggalMulai || null,
        tanggalSelesai: tanggalSelesai || null,
      },
      jumlahData: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};
