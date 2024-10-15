const app = require("./src/app");
const sequelize = require("./db/connection");
const port = 3003;

app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.log(`Database synced and server is listening at http://localhost:${port}/restaurants`);
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }
});

