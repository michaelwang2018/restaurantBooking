'use strict';
// const sequelize = require('../db.js');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // Define one-to-one association to Table & Restaurant
    //   Reservation.belongsTo(models.TableType, {
    //     foreignKey: 'TableId',
    //     as: 'table'
    //   });
    //   Reservation.belongsTo(models.Restaurant, {
    //     foreignKey: 'RestaurantId',
    //     as: 'restaurant'
    //   });

      // Define many-to-many association to Eater through a join table
    //   Reservation.belongsToMany(models.Eater, {
    //     through: 'ReservationEaters',
    //     as: 'eaters',
    //     foreignKey: 'ReservationId',
    //     otherKey: 'EaterId'
    //   });


    }
  }
  Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    restaurant: {
      type: DataTypes.STRING,
      references: {
        model: 'Restaurants',
        key: 'name',
      }
    },
    eaters: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('eaters').split(', ')
      },
      set(val) {
        this.setDataValue('eaters', val.join(', '));
      }
    },
    tableSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // TableId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'Tables',
    //     key: 'id',
    //   },
    //   allowNull: false,
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE',
    // },
    time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};
