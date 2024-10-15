const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Restaurant = sequelize.define("restaurants", {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    cuisine: DataTypes.STRING
});

module.exports = Restaurant;
