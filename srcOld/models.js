"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.Table = exports.Endorsement = exports.Restaurant = exports.DietaryRestriction = exports.Eater = void 0;
// Assuming sequelize is already initialized
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('sqlite:restaurant_booking.db');
const Eater = sequelize.define('Eater', {
    name: sequelize_1.DataTypes.STRING,
});
exports.Eater = Eater;
const DietaryRestriction = sequelize.define('DietaryRestriction', {
    name: sequelize_1.DataTypes.STRING,
});
exports.DietaryRestriction = DietaryRestriction;
Eater.hasMany(DietaryRestriction);
DietaryRestriction.belongsTo(Eater);
const Restaurant = sequelize.define('Restaurant', {
    name: sequelize_1.DataTypes.STRING,
});
exports.Restaurant = Restaurant;
const Endorsement = sequelize.define('Endorsement', {
    name: sequelize_1.DataTypes.STRING,
});
exports.Endorsement = Endorsement;
Restaurant.hasMany(Endorsement);
Endorsement.belongsTo(Restaurant);
const Table = sequelize.define('Table', {
    capacity: sequelize_1.DataTypes.INTEGER,
});
exports.Table = Table;
Restaurant.hasMany(Table);
Table.belongsTo(Restaurant);
const Reservation = sequelize.define('Reservation', {
    time: sequelize_1.DataTypes.DATE,
});
exports.Reservation = Reservation;
Table.hasMany(Reservation);
Reservation.belongsTo(Table);
Eater.belongsToMany(Reservation, { through: 'ReservationEaters' });
Reservation.belongsToMany(Eater, { through: 'ReservationEaters' });
sequelize.sync({ force: true }).then(() => console.log("Database & tables created!"));
