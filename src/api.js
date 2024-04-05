"use strict";
const express = require('express');
const sequelize = require('./db');
const { Op } = require('sequelize');
const Eater = require('./eater');
const Restaurant = require('./restaurant'); // Fix: Change the import statement to match the correct casing
const Reservation = require('./Reservation');
const { getEatersController, getEaterController, postEaterController, postEatersController } = require('./controller/eaterApi');
const { createReservationController, getReservationsController, getReservationController, putReservationController, postBootlegReservationsController } = require('./controller/reservationApi');
const { searchRestaurantsController, getRestaurantsController, postRestaurantsController } = require('./controller/restaurantApi');


const app = express();
app.use(express.json());
const PORT = 3000;
const twoHours = 2 * 60 * 60 * 1000 - 1 * 60 * 1000; // Two hours in milliseconds - 1 minute in milliseconds to allow for back to back reservations

sequelize.sync().then(() => {
    console.log('Database synced');
});

app.get('/restaurants', async (req, res) => {
    searchRestaurantsController(req, res);
});

app.post('/reservations', async (req, res) => {
    createReservationController(req, res);
});

app.delete('/reservations', async (req, res) => {
    deleteReservationController(req, res);
});

// APIs for testing purposes only
app.post('/eaters', async (req, res) => {
    postEatersController(req, res);
});

app.get('/eaters', async (req, res) => {
    getEatersController(res);
});

app.get('/eaters/:name', async (req, res) => {
    getEaterController(req, res);
});

app.post('/eaters/:name', async (req, res) => {
    postEaterController(req, res);
});

app.get('/reservations', async (req, res) => {
    getReservationsController(req, res);
});

app.get('/reservation', async (req, res) => {
    getReservationController(req, res);
});

app.put('/reservations/:id', async (req, res) => {
    putReservationController(req, res);
});

app.post('/bootlegReservations', async (req, res) => {
    postBootlegReservationsController(req, res);
});

app.get('/allRestaurants', async (req, res) => {
    getRestaurantsController(req, res);
});

app.post('/restaurants', async (req, res) => {
    postRestaurantsController(req, res);
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
