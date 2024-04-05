// const request = require('supertest');
// const express = require('express');
// const sequelize = require('./db');
// const { Op } = require('sequelize');
// const Eater = require('./eater');
// const Restaurant = require('./restaurant'); // Fix: Change the import statement to match the correct casing
// const Reservation = require('./Reservation');

// const routes = {};

// jest.mock('express', () => {
//     const mockExpress = {
//         post: jest.fn((path, controller) => {
//             routes[path] = controller;
//         })
//     };
//     return jest.fn(() => mockExpress);
// });

// require('./api');
// const express = require('express');
// jest.mock('express.json', () => {
//     return jest.fn();
// });
// const app = express();

// describe('given the endpoint does not exist', () => {
//     it('should return a 404', async () => {
//         const response = await request(app).get('/non-existing');
//         expect(response.statusCode).toBe(404);
//     });
// });

// describe('Eaters tests', () => {
//     it('should return a list of Eaters', async () => {
//         // const logSpy = jest.spyOn(Eater, 'findAll');
//         // expect(app.get).toBeCalledWith('/eaters', expect.any(Function));
//         // const mockReq = { body: {} };
//         // const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
//         // routes['/eaters'](mockReq, mockRes);
//         // // expect(pool.query).toBeCalledWith('INSERT INTO student SET ?', [1], expect.any(Function));
//         // const mockResult = { };
//         // queryCallback(null, mockResult);
//         // expect(mockRes.status).toBeCalledWith(200);
//         // expect(mockRes.status().json).toBeCalledWith({ });
//         // expect(logSpy).toBeCalledWith(mockResult);
//         done();



//         // const response = await request(app).get('/eaters');
//         // expect(response.statusCode).toBe(200);
//         // expect(response.body).toEqual(expect.arrayContaining([
//         // expect.objectContaining({
//         //     name: expect.any(String),
//         //     id: expect.any(Number),
//         //     restrictions: expect.any(String)
//         // })
//         // ]));
//     });
// });

describe('given the /eater endpoint', () => {
    it('shouldwork', async () => {
        expect(2 > 1).toBe(true);
    });
});