const Restaurant = require('./Restaurant');
const Menu = require('./Menu');
const Item = require('./Item');

// Define associations
Restaurant.hasMany(Menu); // A Restaurant may have one or more Menus
Menu.belongsTo(Restaurant); // Every Menu has one Restaurant

Menu.belongsToMany(Item, { through: 'MenuItems' }); // A Menu can have many Items
Item.belongsToMany(Menu, { through: 'MenuItems' }); // An Item can be on many Menus

module.exports = {
    Restaurant,
    Menu,
    Item,
};
