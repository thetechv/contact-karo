import Redis from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 2000, // 2s timeout for initial connection
  maxRetriesPerRequest: 1, // Fail fast on commands
  retryStrategy: (times) => Math.min(times * 50, 2000), // Retry backoff
});

// Prevent crash on Redies connection error
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const MAX_IP_REQUESTS = 60;
const MAX_PHONE_REQUESTS = 10;

export async function publicAuth(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress;

  if (!ip) {
    return res.status(400).json({ success: false, message: "Invalid IP" });
  }

  try {
    // Check block
    if (await redis.get(`block:ip:${ip}`)) {
      return res.status(403).json({
        success: false,
        message: "Your IP is temporarily blocked",
      });
    }

    // IP limit
    const ipKey = `rate:ip:${ip}`;
    const ipCount = await redis.incr(ipKey);
    if (ipCount === 1) await redis.expire(ipKey, 60);

    if (ipCount > MAX_IP_REQUESTS) {
      await redis.set(`block:ip:${ip}`, 1, "EX", 3600);
      return res.status(429).json({
        success: false,
        message: "Too many requests from your IP",
      });
    }

    // Phone OTP limit
    const phone = req.body?.phone?.replace(/\D/g, "");
    if (phone) {
      const phoneKey = `rate:phone:${phone}`;
      const phoneCount = await redis.incr(phoneKey);
      if (phoneCount === 1) await redis.expire(phoneKey, 600);

      if (phoneCount > MAX_PHONE_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: "OTP limit exceeded for this phone number. Please try again after 10 minutes.",
        });
      }
    }

    next(req, res); // ✅ important
  } catch (err) {
    console.error("Redis error, skipping rate limit:", err);
    next(req, res); // ✅ fail-open
  }
}
