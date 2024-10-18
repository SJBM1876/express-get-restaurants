const request = require('supertest');
const app = require('./src/app'); // Adjust the path if necessary
const path = require('path');

let restaurantId; // Variable to store the ID of the restaurant for later tests

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

it('should return 404 if restaurant not found for GET /restaurants/:id', async () => {
    const response = await request(app).get('/restaurants/999'); // Non-existent ID
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Restaurant not found');
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

// Test validation errors for POST /restaurants
it('should return an error if name is empty', async () => {
    const newRestaurant = { location: 'New Location', cuisine: 'New Cuisine' };
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                location: 'body',
                msg: 'Name must not be empty',
                path: 'name',
                value: "",
                type: 'field'
            })
        ])
    );
});

it('should return an error if location is empty', async () => {
    const newRestaurant = { name: 'New Restaurant', cuisine: 'New Cuisine' };
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                location: 'body',
                msg: 'Location must not be empty',
                path: 'location',
                value: "",
                type: 'field'
            })
        ])
    );
});

it('should return an error if cuisine is empty', async () => {
    const newRestaurant = { name: 'New Restaurant', location: 'New Location' };
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                location: 'body',
                msg: 'Cuisine must not be empty',
                path: 'cuisine',
                value: "",
                type: 'field'
            })
        ])
    );
});

it('should return multiple errors if multiple fields are empty', async () => {
    const newRestaurant = {};
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                location: 'body',
                msg: 'Name must not be empty',
                path: 'name',
                value: "",
                type: 'field'
            }),
            expect.objectContaining({
                location: 'body',
                msg: 'Location must not be empty',
                path: 'location',
                value: "",
                type: 'field'
            }),
            expect.objectContaining({
                location: 'body',
                msg: 'Cuisine must not be empty',
                path: 'cuisine',
                value: "",
                type: 'field'
            })
        ])
    );
});

// New validation tests for name length
it('should return an error if name is less than 10 characters', async () => {
    const newRestaurant = { name: 'Short', location: 'New Location', cuisine: 'New Cuisine' };
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                location: 'body',
                msg: 'Name must be between 10 and 30 characters long',
                path: 'name',
                value: "Short",
                type: 'field'
            })
        ])
    );
});

it('should return an error if name is more than 30 characters', async () => {
    const newRestaurant = { name: 'This is a very long name for a restaurant that exceeds thirty', location: 'New Location', cuisine: 'New Cuisine' };
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                location: 'body',
                msg: 'Name must be between 10 and 30 characters long',
                path: 'name',
                value: newRestaurant.name,
                type: 'field'
            })
        ])
    );
});

it('should return 201 if name is valid (between 10 and 30 characters)', async () => {
    const newRestaurant = { name: 'Valid Name', location: 'New Location', cuisine: 'New Cuisine' };
    const response = await request(app)
        .post('/restaurants')
        .send(newRestaurant);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Valid Name');
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

it('should return 404 if restaurant not found for PUT /restaurants/:id', async () => {
    const updatedData = { name: 'Updated Restaurant' };
    const response = await request(app)
        .put('/restaurants/999') // Non-existent ID
        .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Restaurant not found');
});

// Test DELETE /restaurants/:id
it('should delete a restaurant with DELETE /restaurants/:id', async () => {
    const response = await request(app)
        .delete(`/restaurants/${restaurantId}`);

    expect(response.status).toBe(204); // No content

    const deletedRestaurant = await request(app).get(`/restaurants/${restaurantId}`);
    expect(deletedRestaurant.status).toBe(404); // Not found
    expect(deletedRestaurant.body.error).toBe('Restaurant not found');
});


  







