"use strict";
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('restaurant-booking-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './db.development.sqlite',
    logging: false
});

module.exports = sequelize;