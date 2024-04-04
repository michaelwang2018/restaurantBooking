// Assuming sequelize is already initialized
import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite:restaurant_booking.db');

const Eater = sequelize.define('Eater', {
  name: DataTypes.STRING,
});

const DietaryRestriction = sequelize.define('DietaryRestriction', {
  name: DataTypes.STRING,
});

Eater.hasMany(DietaryRestriction);
DietaryRestriction.belongsTo(Eater);

const Restaurant = sequelize.define('Restaurant', {
  name: DataTypes.STRING,
});

const Endorsement = sequelize.define('Endorsement', {
  name: DataTypes.STRING,
});

Restaurant.hasMany(Endorsement);
Endorsement.belongsTo(Restaurant);

const Table = sequelize.define('Table', {
  capacity: DataTypes.INTEGER,
});

Restaurant.hasMany(Table);
Table.belongsTo(Restaurant);

const Reservation = sequelize.define('Reservation', {
  time: DataTypes.DATE,
});

Table.hasMany(Reservation);
Reservation.belongsTo(Table);

Eater.belongsToMany(Reservation, { through: 'ReservationEaters' });
Reservation.belongsToMany(Eater, { through: 'ReservationEaters' });

sequelize.sync({ force: true }).then(() => console.log("Database & tables created!"));

export { Eater, DietaryRestriction, Restaurant, Endorsement, Table, Reservation };
