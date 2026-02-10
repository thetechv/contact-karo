import dotenv from "dotenv";
import path from "path";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import dbConnect from "../lib/mongodb.js";
import generateBatchQRJob from "./generateBatchQR.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

connection.on("error", (err) =>
  console.error("Redis connection error:", err.message)
);
connection.on("connect", () => console.log("Worker connected to Redis"));

class BatchWorker extends Worker {
  constructor() {
    super("batchQueue", async (job) => this.jobsMapper(job), { connection });
  }

  async jobsMapper(job) {
    if (typeof this[job.name] === "function") {
      try {
        console.log(`Executing ${job.name}...`);
        await this[job.name](job);
        console.log(`${job.name} completed`);
      } catch (error) {
        console.error(`${job.name} failed:`, error.message);
        throw error;
      }
    } else {
      console.error(`No handler for job: ${job.name}`);
    }
  }

  addJobListener(jobName, cb) {
    this[jobName] = cb;
  }
}

const worker = new BatchWorker();

worker.addJobListener("generateBatchQR", generateBatchQRJob);

worker.on("failed", (job, err) =>
  console.error(`Job ${job.name} failed:`, err)
);
worker.on("error", (err) => console.error("Worker error:", err));
worker.on("completed", (job) => console.log(`Job ${job.name} completed`));

dbConnect()
  .then(() => {
    console.log("Worker connected to MongoDB");
  })
  .catch(err => {
    console.error("Worker failed to connect to MongoDB", err);
  });

export default worker;
