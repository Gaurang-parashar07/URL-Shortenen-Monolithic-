require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
const PORT = process.env.PORT || 4000;

connectDB();
connectRedis();

app.listen(PORT, () => {
    console.log(`Server Started at PORT : ${PORT}`);
})