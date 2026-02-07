
const Redis = require("ioredis");

// Make sure this matches your .env or default local
const redis = new Redis("redis://localhost:6379");

async function clearLimits() {
  try {
    console.log("Scanning for blockage and rate limit keys...");
    
    // Find keys matching your middleware's patterns
    const blockKeys = await redis.keys("block:ip:*");
    const ipRateKeys = await redis.keys("rate:ip:*");
    const phoneRateKeys = await redis.keys("rate:phone:*");

    const allKeys = [...blockKeys, ...ipRateKeys, ...phoneRateKeys];

    if (allKeys.length > 0) {
      await redis.del(allKeys);
      console.log(`✅ Successfully cleared ${allKeys.length} keys:`);
      allKeys.forEach(k => console.log(` - ${k}`));
      console.log("\nYou can now run the stress test again to see the '50 allowed -> blocked' flow.");
    } else {
      console.log("No rate-limit keys found. You are good to go!");
    }
  } catch (error) {
    console.error("Error clearing Redis:", error);
  } finally {
    redis.disconnect();
  }
}

clearLimits();
