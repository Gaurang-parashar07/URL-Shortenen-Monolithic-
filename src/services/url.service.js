const repository = require("../repositories/url.repository");
const base62 = require("../utils/base62");
const { redisClient } = require("../config/redis");

const isRedisReady = () => redisClient && redisClient.isOpen;

exports.createShortUrl = async (originalUrl) => {
    if (!originalUrl) {
        throw new Error("Original URL is required...");
    }

    const id = await repository.create(originalUrl);
    console.log("ID from original URL:", id);

    const num = BigInt("0x" + id.toString());
    const shortCode = base62.encode(num);
    console.log("Short code generated:", shortCode);

    await repository.updatedCode(id, shortCode);

    try {
        if (isRedisReady()) {
            await redisClient.set(shortCode, originalUrl, { EX: 86400 });
            console.log("Cached newly created short code in Redis:", shortCode);
        }
    } catch (cacheErr) {
        console.error("Redis set error:", cacheErr.message);
    }

    const PORT = process.env.PORT || 4000;
    return {
        shortUrl: `http://localhost:${PORT}/api/url/${shortCode}`
    };
};

exports.getOriginalUrl = async (code) => {
    try {
        if (isRedisReady()) {
            const cachedUrl = await redisClient.get(code);
            if (cachedUrl) {
                console.log(`[Cache HIT] Retrieved from Redis for code: ${code}`);
                return cachedUrl;
            }
        }
    } catch (cacheErr) {
        console.error("Redis get error:", cacheErr.message);
    }

    console.log(`[Cache MISS] Fetching from MongoDB for code: ${code}`);
    const data = await repository.findByCode(code);

    if (!data) throw new Error("URL Not Found...");

    try {
        if (isRedisReady()) {
            await redisClient.set(code, data.originalUrl, { EX: 86400 });
            console.log(`[Cache STORE] Saved in Redis for code: ${code}`);
        }
    } catch (cacheErr) {
        console.error("Redis cache save error:", cacheErr.message);
    }

    return data.originalUrl;
}
