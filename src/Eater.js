"use strict";
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Eater extends Model {
}
Eater.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    restrictions: {
        type: DataTypes.STRING,
        allowNull: true,
        // get() {
        //     return this.getDataValue('restrictions').split(', ')
        // },
        // set(val) {
        //     this.setDataValue('restrictions', val.join(', '));
        // }
    },
}, { sequelize, modelName: 'Eater' });
module.exports = Eater;
