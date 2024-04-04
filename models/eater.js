'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eater extends Model {
    static associate(models) {
      // Keep existing associations
      // Eater.hasMany(models.Restriction, {
      //   foreignKey: 'EaterId',
      //   as: 'restrictions'
      // });

      // Add new many-to-many association to Reservations through a join table
      Eater.hasMany(models.Reservation, {
        through: 'ReservationEaters',
        as: 'reservations',
        foreignKey: 'EaterId',
        otherKey: 'ReservationId'
      });
    }
  }
  Eater.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    restrictions: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('restrictions').split(';')
      },
      set(val) {
        this.setDataValue('restrictions',val.join(';'));
      }
    }
  }, {
    sequelize,
    modelName: 'Eater',
  });
  return Eater;
};
