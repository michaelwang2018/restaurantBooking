'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate(models) {
      // define association here
      Table.belongsTo(models.Restaurant);
    }
  }
  Table.init({
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
    modelName: 'Table',
  });
  return Table;
};

