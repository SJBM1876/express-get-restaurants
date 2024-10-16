const express = require("express");
const { check, validationResult } = require('express-validator');
const app = express();

const restaurantsRouter = require("../routes/restaurants");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/restaurants", restaurantsRouter);

// Validation middleware for POST /restaurants
const validateRestaurant = [
  check('name').not().isEmpty().withMessage('Name must not be empty'),
  check('location').not().isEmpty().withMessage('Location must not be empty'),
  check('cuisine').not().isEmpty().withMessage('Cuisine must not be empty'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      include: [{
        model: Menu,
        include: [{
          model: Item
        }]
      }]
    });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch restaurants' });
  }
});

app.get("/restaurants/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch restaurant' });
  }
});

app.post("/restaurants", validateRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create restaurant' });
  }
});

app.put("/restaurants/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedRest = await Restaurant.update(req.body, { where: { id } });
    if (updatedRest[0] === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(updatedRest);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update restaurant' });
  }
});

app.delete("/restaurants/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRest = await Restaurant.destroy({ where: { id } });
    if (deletedRest === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete restaurant' });
  }
});

module.exports = app;

