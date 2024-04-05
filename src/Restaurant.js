"use strict";
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Restaurant extends Model {
}
Restaurant.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endorsements: {
        type: DataTypes.STRING,
        allowNull: true,
        // get() {
        //     return this.getDataValue('restrictions').split(', ')
        // },
        // set(val) {
        //     this.setDataValue('restrictions', val.join(', '));
        // }
    },
}, { sequelize, modelName: 'Restaurant' });
module.exports = Restaurant;
