'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      Presensi.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Presensi.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      nama: {                     
        type: DataTypes.STRING,
        allowNull: true,         
      },
      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Presensi',
    }
  );

  return Presensi;
};
