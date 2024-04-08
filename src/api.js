"use strict";
const express = require('express');
const sequelize = require('./db');
const { Op } = require('sequelize');
const Eater = require('./models/Eater');
const Restaurant = require('./models/Restaurant');
const Reservation = require('./models/Reservation');


const app = express();
app.use(express.json());

// Two hours in milliseconds - 1 minute in milliseconds to allow for back to back reservations
const twoHours = 2 * 60 * 60 * 1000 - 1 * 60 * 1000; 

sequelize.sync();

/**
 * Returns the list of restaurants that have available tables that fit 
 * the party size of the group based on the restrictions of the eaters 
 * in the group and the availability of tables at the desired time of the reservation
 * 
 * The request body should contain the following fields:
 * - eaters: a comma-and-space-separated string of eater names
 * - time: a string representing the desired time of the reservation
 * 
 * @param body: here's an example of the request body: 
 * {
        "eaters": "Scott, Elise",
        "time": "Apr 9 2024 13:00 PST"
    }
 * @returns Restaurant[] - the list of restaurants that is suitable for the party
    example:
    [
        "Falling Piano Brewing Co",
        "u.to.pi.a"
    ]
 * 
 * 
 * 
 * 
 */
app.get('/restaurants', async (req, res) => {
    try {
        // null check to ensure that the request has eaters
        if (req.body.eaters === undefined || req.body.eaters === null || req.body.eaters.length < 1) {
            return res.status(400).send('No eaters provided');
        }
        const eaterNames = req.body.eaters.split(', ');
        const partySize = eaterNames.length;

        if (eaterNames.length > 6) {
            return res.status(400).send('Too many eaters. No more than 6 eaters allowed');
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
                    [Op.and]: endorsements.map(endorsement => ({
                        [Op.like]: `%${endorsement}%`
                    }))
                }
            }
        });

        const restaurantNames = restaurants.map(restaurant => restaurant.name)

        const targetTime = new Date(req.body.time);

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
        return res.json(availableRestaurants);
        
    }
    catch (error) {
        res.status(400).send('Failed to fetch available restaurants: ' + error.message);
    }
});

/**
 * (attempts to) Create(s) a reservation for the given restaurant, time, and eaters
 * Designed to be called after calling the /restaurants endpoint to ensure the restaurant 
 * is suitable for the party's restrictions, party size and availability
 *
 * 
 * The request body should contain the following fields:
 * - eaters: a comma-and-space-separated string of eater names
 * - time: a string representing the desired time of the reservation
 * - restaurant: a string representing the name of the restaurant
 * 
 * @param body: here's an example of the request body: 
 * {
        "eaters": "Scott, George, Elise",
        "time": "Apr 9 2024 15:00 PST",
        "restaurant": "Falling Piano Brewing Co"
    }
 * @returns string - a confirmation message that contains the id of the reservation
    example:
    Reservation created with id: 47
 * 
 * 
 * 
 * 
 */
app.post('/reservations', async (req, res) => {
    try {
        const restaurantName = req.body.restaurant;
        const eaterNames = req.body.eaters.split(', ');

        // Check if the restaurant exists (this check and the eaters check aren't really necessary if we're assuming this endpoint is
        // called after the /restaurants endpoint and we assume the Eater and Restaurant didn't get deleted, but checking to be safe)
        const restaurant = await Restaurant.findOne({ where: { name: restaurantName } });
        if (!restaurant) {
            return res.status(400).send('Restaurant not found');
        }

        // Check if the eaters exist
        const eaters = await Eater.findAll({
            where: {
                name: {
                    [Op.in]: eaterNames
                }
            }
        });
        if (eaters.length !== eaterNames.length) {
            return res.status(400).send('One or more eaters not found');
        }

        
        const partySize = eaterNames.length;

        const targetTime = new Date(req.body.time);

        // Check if Eaters have any conflicting reservations
        const eaterReservations = await Reservation.findAll({
            where: {
                eaters: {
                    [Op.or]: eaterNames.map(eater => ({
                        [Op.like]: `%${eater}%`
                    }))
                },
                time: {
                    [Op.and]: {
                        [Op.gte]: new Date(targetTime - twoHours), // 2 hours before the target time
                        [Op.lte]: new Date(targetTime + twoHours) // 2 hours after the target time
                    }
                }
            }
        });
        if (eaterReservations.length > 0) {
            return res.status(400).send('One or more eaters have conflicting reservations');
        }


        // Check existing reservations that overlap with the proposed reservation time to confirm suitable table size is available at the restaurant
        const reservations = await Reservation.findAll({
            where: {
                restaurant: restaurantName,
                time: {
                    [Op.and]: {
                        [Op.gte]: new Date(targetTime - twoHours),
                        [Op.lte]: new Date(targetTime + twoHours)
                    }
                }
            }
        });

        const bookingTableSize = findMinimumAvailableTableSize(restaurant, reservations, partySize);
        if (bookingTableSize === 0) {
            return res.status(400).send('No suitable table size available at your requested restaurant and time. Please try another time or restaurant.');
        }

        // Create the reservation
        const reservation = await Reservation.create({
            restaurant: restaurantName,
            time: targetTime,
            eaters: req.body.eaters,
            tableSize: bookingTableSize,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        res.send('Reservation created with id: ' + reservation.id);
    }
    catch (error) {
        res.status(400).send('Failed to create Reservation with error: ' + error.message);
    }
});

/**
 * Deletes the given reservation
 * 
 * The request body should contain the following:
 * - id: an integer representing the id of the reservation to be deleted
 * - eater: an optional string representing the name of the person requesting the deletion
 * 
 * @param body: here's an example of the request body: 
 * {
        "id": "45",
        "eater":"George"
    }
 * @returns Reservation - the json object representation of the deleted Reservation
 * example:
    {
        "id": 45,
        "restaurant": "Falling Piano Brewing Co",
        "eaters": "Scott, George, Elise",
        "tableSize": 4,
        "time": "2024-04-10 03:00:00.000 +00:00",
        "createdAt": "2024-04-06 01:20:11.320 +00:00",
        "updatedAt": "2024-04-06 01:20:11.320 +00:00"
    }
 * 
 * 
 * 
 * 
 */
app.delete('/reservations', async (req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(400).send('Failed to delete reservation. No id provided');
        }
        const reservation = await Reservation.findOne({ where: {id: id}});
        if (!reservation) {
            return res.status(410).send('Reservation does not exist');
        }

        // preventing unauthorized deletion of reservations
        if (req.body.eater !== null && req.body.eater !== undefined) {
            console.log(reservation);
            const eaterNames = reservation.eaters.split(', ');
            const isPresent = eaterNames.some(name => name.includes(req.body.eater));
            if (!isPresent) {
                return res.status(401).send('Eater not found in reservation. Unauthorized to delete reservation.');
            }
        }
        reservation.destroy();
        res.json(reservation);
    }
    catch (error) {
        res.status(400).send('Failed to delete Reservation: ' + error.message);
    }
});

/**
 * Returns the list of restaurants with available tables that fits the party size 
 * based on existing reservations and number of tables each restaurant has. 
 * Helper method for /restaurants GET endpoint.
 * 
 * 
 * @param reservations: Reservation[]
 * @param restaurants: Restaurant[]
 * @param partySize: number
 * @returns restaurant[] - the restaurants that have available suitable tables
 */
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

/**
 * Returns the smallest available table size that fits the party based on the given restaurant, 
 * existing reservations, and party size. Helper method for /reservations POST endpoint.
 * 
 * It returns 0 if no suitable table size is available
 * 
 * @param restaurant: Restaurant
 * @param reservations: Reservation[]
 * @param partySize: number
 * @returns number - the smallest available table size that fits the party
 */
function findMinimumAvailableTableSize(restaurant, reservations, partySize) {
    // Aggregate reservations by table size
    const reservationCounts = reservations.reduce((counts, reservation) => {
        counts[reservation.tableSize] = (counts[reservation.tableSize] || 0) + 1;
        return counts;
    }, {});

    // Define table sizes and their respective counts from the restaurant object
    const sizes = [
        { size: 2, count: restaurant.two_top },
        { size: 4, count: restaurant.four_top },
        { size: 6, count: restaurant.six_top }
    ];

    // Filter sizes to find which ones are available for the given party size
    const availableTableSizes = sizes.filter(({ size, count }) => {
        const bookedTables = reservationCounts[size] || 0;
        const availableTables = count - bookedTables;
        return availableTables > 0 && size >= partySize;
    });

    // Find the smallest available table size that fits the party
    if (availableTableSizes.length > 0) {
        const smallestAvailableSize = availableTableSizes.reduce((min, sizeInfo) => 
            sizeInfo.size < min.size ? sizeInfo : min
        );
        return smallestAvailableSize.size;
    }

    // Return 0 if no suitable table size is available
    return 0;
}

module.exports = app;