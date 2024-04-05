const request = require('supertest');
const express = require('express');
const sequelize = require('./db');
const { Op } = require('sequelize');
const Eater = require('./eater');
const Restaurant = require('./restaurant'); // Fix: Change the import statement to match the correct casing
const Reservation = require('./Reservation');


const app = express();
app.use(express.json());

describe('GET /eaters', () => {
    it('should return a 404 for non-existing endpoints', async () => {
        const response = await request(app).get('/non-existing');
        expect(response.statusCode).toBe(404);
    });

    it('should return a list of Eaters', async () => {
        const response = await request(app).get('/eaters');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
            name: expect.any(String),
            id: expect.any(Number),
            restrictions: expect.any(String)
        })
        ]));
    });
});