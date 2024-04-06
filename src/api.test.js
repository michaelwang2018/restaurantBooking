const request = require('supertest');
const app = require('./api'); 

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const restaurantNames = ["Lardo", "Panadería Rosetta", "Tetetlán", "Falling Piano Brewing Co", "u.to.pi.a"];

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

describe('given the endpoint does not exist', () => {
    it('should return a 404', async () => {
        const response = await request(app).get('/non-existing').then((response) => response);
        expect(response.statusCode).toBe(404);
    });
});

describe('given the /restaurants endpoint', () => {
    it('should fail when given no eaters', async () => {
        const requestBody = {
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            .set('Accept', 'application/json')
            .send(requestBody)
            .expect(400);

        // const response = await request(app).get('/restuarants').then((response) => response);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('No eaters provided');
    });

    it('should fail when given too many eaters', async () => {
        const requestBody = {
            eaters: "Scott, George, Elise, Birju, Rachel, Jess, John",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            // .set('Accept', 'application/json')
            .send(requestBody)
            .expect(400);

        expect(response.text).toBe('Too many eaters. No more than 6 eaters allowed');
    });

    it('should return all available restaurants when given an Eater with no restrictions', async () => {
        const requestBody = {
            eaters: "Scott",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            .send(requestBody)
            .expect(200);

        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(5);
        
        restaurantNames.map(restaurant => {
            expect(responseJson).toContain(restaurant);
        });
    });

    it('should return the valid restaurant respecting their restrictions when given valid Eaters', async () => {
        const requestBody = {
            eaters: "Scott, George, Elise",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            .send(requestBody)
            .expect(200);

        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(1);
        expect(responseJson[0]).toBe(restaurantNames[3]);
    });

    it('should return the valid restaurants respecting their restrictions when given valid Eaters', async () => {
        const requestBody = {
            eaters: "Scott, George",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            .send(requestBody)
            .expect(200);

        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(2);
        expect(responseJson).toContain(restaurantNames[3]);
        expect(responseJson).toContain(restaurantNames[4]);
    });

    it('should return the only restuarants that can fit the party size that is too large to fit the Eaters at some restaurants', async () => {
        const requestBody = {
            eaters: "Scott, Birju, Rachel, Mike, Allie",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            // .set('Accept', 'application/json')
            .send(requestBody)
            .expect(200);
        
        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(3);
        expect(responseJson).toContain(restaurantNames[0]);
        expect(responseJson).toContain(restaurantNames[2]);
        expect(responseJson).toContain(restaurantNames[3]);
    });

    it('should return no restuarants if no Restaurant endorsements match the restrictions of the Eater', async () => {
        const requestBody = {
            eaters: "Jess",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            // .set('Accept', 'application/json')
            .send(requestBody)
            .expect(200);
        
        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(0);
    });

    // TODO: more tests to be added
    
});

describe('given the /reservations endpoint', () => {
    const body = {
        "eaters": "Scott, George, Elise",
        "time": "Apr 9 2024 13:00 PST",
        "restaurant": "Falling Piano Brewing Co"
    }

    // TODO: more tests to be added
});

// tests for the less relevant testing endpoints
describe('given the /eaters endpoint', () => {
    it('should return all the eaters', async () => {
        const response = await request(app)
            .get('/eaters')
            .expect(200);

        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(11);
    });

    test.skip('should return the specified eater', async () => {
        const response = await request(app)
            .get('/eaters/Scott')
            .expect(200);

        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(1)
        expect(responseJson[0].name).toBe('Scott');
    });

    it('should return no eater if the eater does not exist', async () => {
        const response = await request(app)
            .get('/eaters/Scottttttt')
            .expect(200);

        expect(response.text.length).toBe(0);
    });

});