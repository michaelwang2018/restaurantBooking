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
    try {
        // null check to ensure that the request has eaters
        if (req.body.eaters === null || req.body.eaters.length < 1) {
            res.status(400).send('No eaters provided');
        }
        const eaterNames = req.body.eaters.split(', ');
        const partySize = eaterNames.length;

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

        const restaurantNames = restaurants.map(restaurant => restaurant.name)

        const targetTime = new Date(req.body.time);
        const twoHours = 2 * 60 * 60 * 1000; // Two hours in milliseconds

        // retrieve the reservations for those restaurants that overlap with the time
        const reservations = await Reservation.findAll({
            where: {
                restaurant: {
                    [Op.in]: restaurantNames // Filter reservations by restaurant names
                },
                time: {
                    [Op.and]: {
                        [Op.gte]: new Date(targetTime - twoHours), // 2 hours before the target time
                        [Op.lte]: new Date(targetTime + twoHours) // 2 hours after the target time
                    }
                }
            }
        });

        const availableRestaurants = countAvailableRestaurants(reservations, restaurants, partySize);

        // return the restaurants that have availability
        res.json(availableRestaurants);
    }
    catch {
        res.status(400).send('Fetching available restaurants failed due to: ' + error.message);
    }
});

// Helper function to count reservations by restaurant and table size. Uses a Map for efficient lookups, but a bit overkill for smaller datasets
function countReservationsWithMap(reservations) {
    const restaurantMap = new Map();

    reservations.forEach(({ restaurant, tableSize }) => {
        if (!restaurantMap.has(restaurant)) {
            restaurantMap.set(restaurant, new Map());
        }
        const tableMap = restaurantMap.get(restaurant);
        const currentCount = tableMap.get(tableSize) || 0;
        tableMap.set(tableSize, currentCount + 1);
    });

    // Optionally convert to an array of objects for easier consumption
    const result = [];
    restaurantMap.forEach((tableMap, restaurant) => {
        tableMap.forEach((count, tableSize) => {
            result.push({ restaurant, tableSize, count });
        });
    });

    return result;
}

// Helper function to count reservations by restaurant and table size. Uses a simple object for counting, which is more straightforward for smaller datasets
function countReservations(reservations) {
    const countMap = {};

    reservations.forEach(reservation => {
        const key = `${reservation.restaurant}|${reservation.tableSize}`;
        if (!countMap[key]) {
            countMap[key] = 0;
        }
        countMap[key]++;
    });

    const result = [];
    for (let key in countMap) {
        const [restaurant, tableSize] = key.split('|');
        result.push({
            restaurant,
            tableSize: parseInt(tableSize),
            count: countMap[key]
        });
    }

    return result;
}

app.post('/reservation', async (req, res) => {
    try {
        await Reservation.create(req.body);
        res.send('Reservation created');
    }
    catch (error) {
        res.status(400).send('Failed to create Reservation with error: ' + error.message);
    }
});

/* function countAvailableRestaurants(reservations, restaurants, partySize) {
    // Create a map of reservations grouped by restaurant and tableSize
    const countMap = reservations.reduce((map, { restaurant, tableSize }) => {
        const key = `${restaurant}|${tableSize}`;
        if (!map[key]) {
            map[key] = 0;
        }
        map[key]++;
        return map;
    }, {});

    // Filter out restaurants that exceed their table capacity
    return restaurants.filter(restaurant => {
        const sizes = ["two_top", "four_top", "six_top"]; // Correspond to table sizes 2, 4, 6
        const capacityLimits = [restaurant.two_top, restaurant.four_top, restaurant.six_top];

        return sizes.every((size, index) => {
            const tableSize = (index + 1) * 2; // Converts 0, 1, 2 index to 2, 4, 6 table sizes
            if (tableSize < partySize) return true; // Skip sizes smaller than the party size

            const reservationCount = countMap[`${restaurant.name}|${tableSize}`] || 0;
            return reservationCount < capacityLimits[index]; // Check if under the limit
        });
    }).map(restaurant => restaurant.name); // Return the names of the filtered restaurants
} */

function countAvailableRestaurants(reservations, restaurants, partySize) {
    // Create a map of reservations grouped by restaurant and tableSize
    const countMap = reservations.reduce((map, { restaurant, tableSize }) => {
        const key = `${restaurant}|${tableSize}`;
        if (!map[key]) {
            map[key] = 0;
        }
        map[key]++;
        return map;
    }, {});

    // Filter out restaurants that exceed their table capacity or don't have an appropriate table size
    return restaurants.filter(restaurant => {
        const sizes = [2, 4, 6]; // Explicit table sizes
        const capacityLimits = [restaurant.two_top, restaurant.four_top, restaurant.six_top];

        // Check for availability of suitable table sizes
        return sizes.some((tableSize, index) => {
            if (tableSize >= partySize) { // Only consider table sizes that can accommodate the party
                const reservationCount = countMap[`${restaurant.name}|${tableSize}`] || 0;
                return reservationCount < capacityLimits[index]; // Check if under the limit
            }
            return false; // Skip sizes smaller than the party size
        });
    }).map(restaurant => restaurant.name); // Return the names of the filtered restaurants
}

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
