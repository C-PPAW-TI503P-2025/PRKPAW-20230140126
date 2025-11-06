const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('praktikum4_20230140126', 'root', 'Sumbodro060405!', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3309
});

sequelize.authenticate()
  .then(() => console.log('✅ Koneksi ke database berhasil'))
  .catch(err => console.error('❌ Gagal konek ke database:', err.message));