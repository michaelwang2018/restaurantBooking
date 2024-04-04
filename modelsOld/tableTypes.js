'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TableType extends Model {
    static associate(models) {
      // define association here
      TableType.belongsTo(models.Restaurant);
    }
  }
  TableType.init({
    capacity: DataTypes.INTEGER,
    RestaurantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Restaurants', // name of the Restaurants table
        key: 'id', // key in Restaurants that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'TableType',
  });
  return TableType;
};

