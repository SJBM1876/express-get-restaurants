const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Menu = sequelize.define("Menu", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Menu;