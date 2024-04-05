"use strict";
const express = require('express');
const sequelize = require('./db');
const { Op } = require('sequelize');
const Eater = require('./Eater');
const Restaurant = require('./Restaurant'); // Fix: Change the import statement to match the correct casing
const Reservation = require('./Reservation');


const app = express();
app.use(express.json());
const PORT = 3000;

sequelize.sync().then(() => {
    console.log('Database synced');
});

app.post('/eaters', async (req, res) => {
    // const { name, restrictions } = req.body;
    // const eater = await Eater.create({ name, restrictions });
    // res.json(eater);
    try {
        await Eater.create(req.body);
        res.send('Eater created');
    }
    catch (error) {
        res.status(404).send('Failed to create Eater with error: ' + error.message);
    }
});

app.get('/eaters', async (req, res) => {
    const eaters = await Eater.findAll();
    res.json(eaters);
});

app.get('/eaters/:name', async (req, res) => {
    const name = req.params.name
    const eater = await Eater.findOne({ where: {name: name}});
    res.json(eater);
});

app.put('/eaters/:name', async (req, res) => {
    const name = req.params.name;
    const eater = await Eater.findOne({ where: {name: name}});
    eater.update(req.body);
    res.json(eater);
});

app.post('/reservations', async (req, res) => {
    // const { name, restrictions } = req.body;
    // const eater = await Eater.create({ name, restrictions });
    // res.json(eater);
    console.log('PRINTING REQUEST BODY FOR EATER:');
    console.log(req.body);
    Eater.create(req.body).then(() => {
        res.send('Eater created');
    });
});

app.get('/reservations', async (req, res) => {
    const eaters = await Eater.findAll();
    res.json(eaters);
});

app.get('/reservations/:id', async (req, res) => {
    const id = req.params.id
    const eater = await Eater.findOne({ where: {id: id}});
    res.json(eater);
});

app.put('/reservations/:id', async (req, res) => {
    const id = req.params.id;
    const reservation = await Reservation.findOne({ where: {name: name}});
    reservation.update(req.body);
    res.json(reservation);
});

app.delete('/reservations', async (req, res) => {
    try {
        const id = req.params.id;
        const reservation = await Reservation.findOne({ where: {id: id}});
        reservation.destroy();
        res.json(reservation);
    }
    catch (error) {
        res.status(400).send('Failed to delete Reservation: ' + error.message);
    }
});

app.get('/restaurants', async (req, res) => {
    // null check to ensure that the request has eaters
    if (req.body.eaters === null || req.body.eaters.length < 1) {
        res.status(400).send('No eaters provided');
    }
    const eaterNames = req.body.eaters.split(', ');

    if (eaterNames.length > 6) {
        // throw an error if there are too many eaters
    }

    // get the restrictions from the people in the request
    const eaters = await Eater.findAll({
        where: {
            name:{
                [Op.or]: eaterNames.map(eater => ({
                    [Op.like]: `${eater}`
                  }))
            }
        }
    });

    const allRestrictions = eaters.flatMap(eater => eater.restrictions.split(", ")).filter(restriction => restriction !== "");
    const endorsements = Array.from(new Set(allRestrictions));

    // find the restaurants that have endorsements for those restrictions
    const restaurants = await Restaurant.findAll({
        limit: 10,
        where: {
            endorsements: {
                // [Op.like]: '%' + req.query.endorsements + '%'
                [Op.and]: endorsements.map(endorsement => ({
                    [Op.like]: `%${endorsement}%`
                  }))
            }
        }
    });

    // retrieve the reservations for those restaurants that overlap with the time
    const reservations = await Reservation.findAll({
        where: {
            restaurant: {
                [Op.in]: restaurants // Filter reservations by restaurant names
            },
            time: {
                [Op.and]: {
                    [Op.gte]: new Date(targetTime - twoHours), // 2 hours before the target time
                    [Op.lte]: new Date(targetTime + twoHours) // 2 hours after the target time
                }
            }
        }
    });

    // return the restaurants that have availability
    res.json(restaurants);
});

app.post('/reservation', async (req, res) => {
    try {
        await Reservation.create(req.body);
        res.send('Reservation created');
    }
    catch (error) {
        res.status(400).send('Failed to create Reservation with error: ' + error.message);
    }
});

// app.use('/api', apiRouter);
// const { User } = require('./models');
// User.create({
//   firstName: 'Jane',
//   lastName: 'Doe',
//   email: 'jane.doe@example.com'
// });
// const { models } = require('./models');
// async function createEater() {
//   await models.Eater.create({
//     name: 'John Doe 2',
//     restrictions: 'Gluten-Free, Nut-Free'
//   });
//   console.log('Eater created');
// }
// createEater();
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
