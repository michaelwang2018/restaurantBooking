"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
// import { IEater, IRestaurant, IReservation } from './models/modelTypes';
const { models } = require('./models');
// declare module '../models' {
//     export interface Eater {
//         // Specify the properties and types for the Eater entity
//     }
//     export interface Restaurant {
//         // Specify the properties and types for the Restaurant entity
//     }
//     export interface Reservation {
//         // Specify the properties and types for the Reservation entity
//     }
// }
const router = express_1.default.Router();
// Middleware to parse JSON bodies
router.use(express_1.default.json());
// Find available restaurants
router.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { diners, time } = req.body;
    // This example assumes diners are passed by names, and dietary restrictions are considered.
    // In a real-world scenario, you'd pass diner IDs and use a more complex query.
    try {
        const availableRestaurants = yield models.Restaurant.findAll({
            include: [{
                    model: models.Restaurant,
                    where: {
                        capacity: {
                            [sequelize_1.Op.gte]: diners.length, // Capacity should be enough for all diners
                        },
                    },
                    include: [{
                            model: models.Reservation,
                            where: {
                                time: {
                                    [sequelize_1.Op.ne]: new Date(time), // Example check for time, you'd need a more complex logic
                                },
                            },
                            required: false, // We want tables regardless if they have reservations at other times
                        }],
                }],
        });
        res.json(availableRestaurants);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error finding available restaurants');
    }
}));
// Create a reservation
router.post('/reservations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableId, dinerIds, time } = req.body;
    try {
        const newReservation = yield models.Reservation.create({
            tableId,
            time,
        });
        yield newReservation.setEaters(dinerIds); // Assuming dinerIds is an array of Eater IDs
        res.status(201).send('Reservation created successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating reservation');
    }
}));
// Delete a reservation
// router.delete('/reservations/:id', async (req: Request, res: Response))
