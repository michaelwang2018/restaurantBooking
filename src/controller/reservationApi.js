const Reservation = require('../Reservation');

async function createReservationController(req, res) {
    try {
        const restaurantName = req.body.restaurant;
        const eaterNames = req.body.eaters.split(', ');

        // Check if the restaurant exists 
        // (this check and the eaters check aren't really necessary if we're assuming this endpoint is
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


        // Check existing reservations to confirm table size is available
        // retrieve the reservations for those restaurants that overlap with the time
        const reservations = await Reservation.findAll({
            where: {
                restaurant: restaurantName,
                time: {
                    [Op.and]: {
                        [Op.gte]: new Date(targetTime - twoHours), // 2 hours before the target time
                        [Op.lte]: new Date(targetTime + twoHours) // 2 hours after the target time
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
}

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

async function deleteReservationController(req, res) {
    try {
        const id = req.body.id;
        const reservation = await Reservation.findOne({ where: {id: id}});

        // preventing unauthorized deletion of reservations
        if (req.body.eater !== null && req.body.eater !== undefined) {
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
}

async function getReservationsController(req, res) {
    try {
        const reservations = await Reservation.findAll();
        res.status(200);
        res.json(reservations);
    }
    catch (error) {
        res.status(400)
        res.send('Failed to fetch Reservations with error: ' + error.message);
    }
}

async function getReservationController(req, res) {
    try {
        const id = req.body.id;
        const reservation = await Reservation.findOne({ where: {id: id}});
        res.status(200).json(reservation);
    }
    catch {
        res.status(400).send('Failed to fetch Reservation: ' + error.message);
    }
}

async function putReservationController(req, res) {
    try {
        const id = req.params.id;
        const reservation = await Reservation.findOne({ where: {id: id}});
        reservation.update(req.body);
        res.json(reservation);
    }
    catch {
        res.status(400).send('Failed to update Reservation: ' + error.message);
    }
}

async function postBootlegReservationsController(req, res) {
    try {
        await Reservation.create(req.body);
        res.status(201).send('Reservation created');
    }
    catch (error) {
        res.status(400).send('Failed to create Reservation with error: ' + error.message);
    }
}


module.exports = { createReservationController, deleteReservationController, getReservationsController, getReservationController, putReservationController, postBootlegReservationsController };