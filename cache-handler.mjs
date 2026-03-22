// @ts-check
import { Redis } from "ioredis";

const CACHE_PREFIX = "nxt:c:";
const TAG_EXP_PREFIX = "nxt:te:";

/** @type {Redis | null} */
let client = null;

function getRedis() {
  if (!client) {
    const url = new URL(process.env.REDIS_URL);
    client = new Redis({
      host: url.hostname,
      port: Number(url.port) || 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      db: url.pathname ? Number(url.pathname.slice(1)) || 0 : 0,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false
    });

    client.on("error", (err) => {
      console.error("[cache-handler] Redis error:", err.message);
    });
  }
  return client;
}

/**
 * @param {ReadableStream<Uint8Array>} stream
 * @returns {Promise<Buffer>}
 */
async function readStream(stream) {
  const reader = stream.getReader();
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}

export default {
  /**
   * @param {string} cacheKey
   * @param {string[]} _softTags
   */
  async get(cacheKey, _softTags) {
    try {
      const redis = getRedis();
      const stored = await redis.get(`${CACHE_PREFIX}${cacheKey}`);
      if (!stored) return undefined;

      const data = JSON.parse(stored);
      const buf = Buffer.from(data.value, "base64");

      return {
        value: new ReadableStream({
          start(controller) {
            controller.enqueue(buf);
            controller.close();
          }
        }),
        tags: data.tags,
        stale: data.stale,
        timestamp: data.timestamp,
        expire: data.expire,
        revalidate: data.revalidate
      };
    } catch (err) {
      console.error("[cache-handler] get error:", err.message);
      return undefined;
    }
  },

  /**
   * @param {string} cacheKey
   * @param {Promise<import('next/dist/server/lib/cache-handlers/types').CacheEntry>} pendingEntry
   */
  async set(cacheKey, pendingEntry) {
    try {
      const redis = getRedis();
      const entry = await pendingEntry;
      const buf = await readStream(entry.value);

      const stored = JSON.stringify({
        value: buf.toString("base64"),
        tags: entry.tags,
        stale: entry.stale,
        timestamp: entry.timestamp,
        expire: entry.expire,
        revalidate: entry.revalidate
      });

      const ttl = entry.expire;
      if (typeof ttl === "number" && ttl > 0 && isFinite(ttl)) {
        await redis.setex(`${CACHE_PREFIX}${cacheKey}`, ttl, stored);
      } else {
        await redis.set(`${CACHE_PREFIX}${cacheKey}`, stored);
      }
    } catch (err) {
      console.error("[cache-handler] set error:", err.message);
    }
  },

  async refreshTags() {},

  /**
   * @param {string[]} tags
   * @returns {Promise<number>}
   */
  async getExpiration(tags) {
    if (tags.length === 0) return 0;
    try {
      const redis = getRedis();
      const keys = tags.map((tag) => `${TAG_EXP_PREFIX}${tag}`);
      const values = await redis.mget(...keys);
      const timestamps = values.map(Number).filter((n) => n > 0);
      return timestamps.length > 0 ? Math.max(...timestamps) : 0;
    } catch (err) {
      console.error("[cache-handler] getExpiration error:", err.message);
      return 0;
    }
  },

  /**
   * @param {string[]} tags
   * @param {{ expire?: number }} [durations]
   */
  async updateTags(tags, durations) {
    try {
      const redis = getRedis();
      const now = Date.now();
      const pipeline = redis.pipeline();
      for (const tag of tags) {
        const key = `${TAG_EXP_PREFIX}${tag}`;
        const ttl = durations?.expire;
        if (typeof ttl === "number" && ttl > 0 && isFinite(ttl)) {
          pipeline.setex(key, ttl, String(now));
        } else {
          pipeline.set(key, String(now));
        }
      }
      await pipeline.exec();
    } catch (err) {
      console.error("[cache-handler] updateTags error:", err.message);
    }
  }
};
