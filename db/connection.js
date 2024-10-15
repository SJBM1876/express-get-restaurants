const path = require('path');
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance for SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db.sqlite'),
    logging: false
});

// Export the sequelize instance directly
module.exports = sequelize;

