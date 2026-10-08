const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    socket: {
        reconnectStrategy: false
    }
});

redisClient.on("error", (err) => {
    console.warn("Redis unavailable, continuing without cache:", err.message);
});

redisClient.on("connect", () => {
    console.log("Redis Connected successfully...");
});

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        return true;
    } catch (error) {
        console.warn("Redis connection failed, app will continue without Redis:", error.message);
        return false;
    }
};

module.exports = {
    redisClient,
    connectRedis
};