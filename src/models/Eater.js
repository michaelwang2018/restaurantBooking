"use strict";
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

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
    },
}, { sequelize, modelName: 'Eater' });

module.exports = Eater;