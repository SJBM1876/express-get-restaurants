const request = require('supertest');
const app = require('./src/app'); // Adjust the path if necessary

describe('Restaurants API', () => {
    let restaurantId;

    // Test GET /restaurants
    it('should return status code 200 for GET /restaurants', async () => {
        const response = await request(app).get('/restaurants');
        expect(response.status).toBe(200);
    });

    it('should return an array of restaurants', async () => {
        const response = await request(app).get('/restaurants');
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return the correct number of restaurants', async () => {
        const response = await request(app).get('/restaurants');
        expect(response.body.length).toBeGreaterThan(0); // Adjust based on expected count
    });

    it('should return correct restaurant data', async () => {
        const response = await request(app).get('/restaurants');
        const firstRestaurant = response.body[0];
        expect(firstRestaurant).toHaveProperty('name');
        expect(firstRestaurant).toHaveProperty('location');
        expect(firstRestaurant).toHaveProperty('cuisine');
    });

    // Test GET /restaurants/:id
    it('should return correct restaurant data for GET /restaurants/:id', async () => {
        const response = await request(app).get('/restaurants/1'); // Adjust ID as necessary
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1); // Adjust based on expected ID
    });

    // Test POST /restaurants
    it('should add a new restaurant with POST /restaurants', async () => {
        const newRestaurant = { name: 'New Restaurant', location: 'New Location', cuisine: 'New Cuisine' };
        const response = await request(app)
            .post('/restaurants')
            .send(newRestaurant);
        
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newRestaurant);

        // Store the ID for later tests
        restaurantId = response.body.id; 
    });

    // Test PUT /restaurants/:id
    it('should update a restaurant with PUT /restaurants/:id', async () => {
        const updatedData = { name: 'Updated Restaurant' };
        const response = await request(app)
            .put(`/restaurants/${restaurantId}`)
            .send(updatedData);
        
        expect(response.status).toBe(200);
        
        const updatedRestaurant = await request(app).get(`/restaurants/${restaurantId}`);
        expect(updatedRestaurant.body.name).toBe(updatedData.name);
    });

    // Test DELETE /restaurants/:id
    it('should delete a restaurant with DELETE /restaurants/:id', async () => {
        const response = await request(app)
            .delete(`/restaurants/${restaurantId}`);
        
        expect(response.status).toBe(204); // No content

        const deletedRestaurant = await request(app).get(`/restaurants/${restaurantId}`);
        expect(deletedRestaurant.status).toBe(404); // Not found
    });
});