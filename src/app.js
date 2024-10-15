const express = require("express");
const app = express();

const restaurantsRouter = require("../routes/restaurants");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/restaurants", restaurantsRouter);

app.get("/restaurants", async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
    const number = req.params.id;
    const restaurant = await Restaurant.findByPk(number);
    res.json(restaurant);
});

app.post("/restaurants", async (req, res) => {
    const restaurant = await Restaurant.create(req.body);
    res.json(restaurant);
});

app.put("/restaurants/:id", async (req, res) => {
    const updatedRest = await Restaurant.update(req.body, { where: { id: req.params.id } });
    res.json(updatedRest);
});

app.delete("/restaurants/:id", async (req, res) => {
    const deletedRest = await Restaurant.destroy({ where: { id: req.params.id } });
    res.json(deletedRest);
});

app.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({
            include: [{
                model: Menu,
                include: [{
                    model: Item // Include Items from the Menu
                }]
            }]
        });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch restaurants' });
    }
});

module.exports = app;

