const Restaurant = require("./models/index")
const { seedRestaurant } = require("./seedData");
const db = require("./db/connection")

const syncSeed = async () => {
    await db.sync({force: true});
    await Restaurant.bulkCreate(seedRestaurant)
    // BONUS: Update with Item and Menu bulkCreate
    const seedMenus = [
        { title: 'Breakfast Menu' },
        { title: 'Lunch Menu' },
    ];
    
    const seedItems = [
        { name: 'Pancakes', image: 'pancakes.jpg', price: 5.99, vegetarian: true },
        { name: 'Burger', image: 'burger.jpg', price: 10.99, vegetarian: false },
    ];
    
    async function syncSeed() {
        await Restaurant.sync({ force: true });
        await Menu.sync({ force: true });
        await Item.sync({ force: true });
    
        // Bulk create Menus and Items
        const menus = await Menu.bulkCreate(seedMenus);
        const items = await Item.bulkCreate(seedItems);
    
        // Example of associating menus with items (adjust as necessary)
        await menus[0].addItems([items[0]]); // Adding Pancakes to Breakfast Menu
        await menus[1].addItems([items[1]]); // Adding Burger to Lunch Menu
    }
    
    syncSeed().then(() => {
        console.log('Seeding complete!');
    }).catch(err => {
        console.error('Error seeding data:', err);
    });

}

syncSeed()