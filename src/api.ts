import express, { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Eater, Restaurant, Table, Reservation } from './models';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Find available restaurants
router.post('/search', async (req: Request, res: Response) => {
  const { diners, time } = req.body;
  // This example assumes diners are passed by names, and dietary restrictions are considered.
  // In a real-world scenario, you'd pass diner IDs and use a more complex query.
  try {
    const availableRestaurants = await Restaurant.findAll({
      include: [{
        model: Table,
        where: {
          capacity: {
            [Op.gte]: diners.length, // Capacity should be enough for all diners
          },
        },
        include: [{
          model: Reservation,
          where: {
            time: {
              [Op.ne]: new Date(time), // Example check for time, you'd need a more complex logic
            },
          },
          required: false, // We want tables regardless if they have reservations at other times
        }],
      }],
    });
    res.json(availableRestaurants);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error finding available restaurants');
  }
});

// Create a reservation
router.post('/reservations', async (req: Request, res: Response) => {
  const { tableId, dinerIds, time } = req.body;
  try {
    const newReservation = await Reservation.create({
      tableId,
      time,
    });
    await newReservation.setEaters(dinerIds); // Assuming dinerIds is an array of Eater IDs
    res.status(201).send('Reservation created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating reservation');
  }
});

// Delete a reservation
router.delete('/reservations/:id', async (req: Request, res: Response)
