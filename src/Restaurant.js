"use strict";
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Restaurant extends Model {
}
Restaurant.init({
    id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    endorsements: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    two_top: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    four_top: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    six_top: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { sequelize, modelName: 'Restaurant' });
module.exports = Restaurant;
