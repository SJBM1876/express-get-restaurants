const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Item = sequelize.define("Item", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    vegetarian: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Item;