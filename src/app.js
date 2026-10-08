const express = require("express");
const urlRoutes = require("./routes/url.routes");
require("dotenv").config();

const app = express();


app.use(express.json())


app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        serverPort: process.env.PORT || 4000,
        pid: process.pid,
        timestamp: new Date().toISOString()
    });
});

app.use("/api/url", urlRoutes);


const errorMiddleware = require("./middlewares/error.middleware");
app.use(errorMiddleware);

module.exports = app;