'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      // define association here
      // Restaurant.hasOne(models.TableType, {
      //   foreignKey: 'RestaurantId',
      //   as: 'tables' // optional alias
      // });
      Restaurant.hasMany(models.Reservation, {
        foreignKey: 'RestaurantId',
        as: 'reservations' // optional alias
      });
      // Restaurant.hasMany(models.Restriction, {
      //   foreignKey: 'RestaurantId',
      //   as: 'restrictions'
      // });
    }
  }
  Restaurant.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    endorsements: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('endorsements').split(';')
      },
      set(val) {
        this.setDataValue('endorsements', val.join(';'));
      }
    },
    two_top: DataTypes.INTEGER,
    four_top: DataTypes.INTEGER,
    six_top: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};
