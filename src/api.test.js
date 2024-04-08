const request = require('supertest');
const app = require('./api'); 

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const restaurantNames = ["Lardo", "Panadería Rosetta", "Tetetlán", "Falling Piano Brewing Co", "u.to.pi.a"];

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
            .send(requestBody)
            .expect(200);
        
        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(3);
        expect(responseJson).toContain(restaurantNames[0]);
        expect(responseJson).toContain(restaurantNames[2]);
        expect(responseJson).toContain(restaurantNames[3]);
    });

    it('should return no restuarants if no Restaurant that has an available table has endorsements that match the restrictions of the Eater', async () => {
        const requestBody = {
            eaters: "Jess",
            time: 'Apr 9 2024 13:00 PST'
        }

        const response = await request(app)
            .get('/restaurants')
            .send(requestBody)
            .expect(200);
        
        const responseJson = JSON.parse(response.text);
        expect(responseJson.length).toBe(0);
    });
});

describe('given the /reservations endpoint', () => {

    // Create a reservation, and delete it
    it('should create a valid reservation and be able to delete it once, but not twice', async () => {
        // Create the reservation
        const requestBody = {
            "eaters": "Scott, George, Elise",
            "time": "Apr 21 2024 19:00 PST",
            "restaurant": "Falling Piano Brewing Co"
        }

        const response = await request(app)
            .post('/reservations')
            .send(requestBody)
            .expect(200);
        
        expect(response.text).toContain('Reservation created with id:');
        const reservationId = response.text.split(': ')[1];
        expect(reservationId).not.toBeNaN();

        // delete the reservation
        const deleteRequestBody = {
            "eater": "George",
            "id": `${reservationId}`
        }

        const deleteResponse = await request(app)
            .delete('/reservations')
            .send(deleteRequestBody)
            .expect(200);

        const deleteResponseJson = JSON.parse(deleteResponse.text);
        expect(deleteResponseJson.id.toString()).toBe(reservationId);

        // try to delete it again
        const failedDeleteResponse = await request(app)
            .delete('/reservations')
            .send(deleteRequestBody)
            .expect(410);

        expect(failedDeleteResponse.text).toBe('Reservation does not exist');
    });

    // Can't create a conflicting reservation

    it('should fail to create a reservation due to an existing reservation conflict', async () => {
        const requestBody = {
            "eaters": "Scott, George, Elise",
            "time": "Apr 9 2024 13:00 PST",
            "restaurant": "Falling Piano Brewing Co"
        }

        const response = await request(app)
            .post('/reservations')
            .send(requestBody)
            .expect(400);
        
        expect(response.text).toBe('One or more eaters have conflicting reservations');
    });

    it('should fail to create a reservation due to an existing reservation conflict testing the end time bound', async () => {
        const requestBody = {
            "eaters": "Scott, George, Elise",
            "time": "Apr 9 2024 14:59 PST",
            "restaurant": "Falling Piano Brewing Co"
        }

        const response = await request(app)
            .post('/reservations')
            .send(requestBody)
            .expect(400);

        expect(response.text).toBe('One or more eaters have conflicting reservations');
    });

    it('should fail to create a reservation due to an existing reservation conflict testing the start time bound', async () => {
        const requestBody = {
            "eaters": "Scott, George, Elise",
            "time": "Apr 9 2024 10:01 PST",
            "restaurant": "Falling Piano Brewing Co"
        }

        const response = await request(app)
            .post('/reservations')
            .send(requestBody)
            .expect(400);

        expect(response.text).toBe('One or more eaters have conflicting reservations');
    });
});

server.close(() => {
    console.log('Server closed');
});