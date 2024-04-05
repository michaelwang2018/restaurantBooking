"use strict";
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Reservation extends Model {}

Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    restaurant: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eaters: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tableSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { sequelize, modelName: 'Reservation' });

module.exports = Reservation;
