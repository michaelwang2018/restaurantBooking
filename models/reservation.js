'use strict';
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
      Reservation.belongsTo(models.Restaurant, {
        foreignKey: 'RestaurantId',
        as: 'restaurant'
      });

      // Define many-to-many association to Eater through a join table
      Reservation.belongsToMany(models.Eater, {
        through: 'ReservationEaters',
        as: 'eaters',
        foreignKey: 'ReservationId',
        otherKey: 'EaterId'
      });


    }
  }
  Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
