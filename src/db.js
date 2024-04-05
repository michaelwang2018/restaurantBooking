"use strict";
const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:'); // Example for SQLite
const sequelize = new Sequelize('restaurant-booking-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './db.development.sqlite'
});
// Import model files
// const EaterModel = require('./models/eater');
// const RestaurantModel = require('./models/restaurant');
// const ReservationModel = require('./models/reservation');
// Initialize models
// const Eater = EaterModel(sequelize, Sequelize.DataTypes);
// const Restaurant = RestaurantModel(sequelize, Sequelize.DataTypes);
// const Reservation = ReservationModel(sequelize, Sequelize.DataTypes);
// Setup a new Sequelize instance for SQLite
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: '../db.development.sqlite'
// });
// const db = {
//     sequelize, // the sequelize instance
//     Sequelize, // the Sequelize library
//     models: {
//         Eater,
//         Restaurant,
//         Reservation
//     }
// };
// module.exports = db;
module.exports = sequelize;
