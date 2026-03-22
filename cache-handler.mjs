// @ts-check
import { Redis } from "ioredis";

const CACHE_PREFIX = "nxt:c:";
const TAGS_PREFIX = "nxt:t:";

function replacer(_key, value) {
  if (value instanceof Map) {
    return { __type: "Map", value: Array.from(value.entries()) };
  }
  return value;
}

function reviver(_key, value) {
  if (value && value.__type === "Map") {
    return new Map(value.value);
  }
  if (value && value.type === "Buffer" && Array.isArray(value.data)) {
    return Buffer.from(value.data);
  }
  return value;
}

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

class CacheHandler {
  constructor(_options) {
    this.redis = getRedis();
  }

  /**
   * @param {string} key
   * @returns {Promise<import('next/dist/server/lib/incremental-cache').CacheHandlerValue | null>}
   */
  async get(key) {
    try {
      const raw = await this.redis.get(`${CACHE_PREFIX}${key}`);
      if (!raw) return null;
      return JSON.parse(raw, reviver);
    } catch (err) {
      console.error("[cache-handler] get error:", err.message);
      return null;
    }
  }

  /**
   * @param {string} key
   * @param {any} data
   * @param {{ revalidate?: number | false; tags?: string[] }} ctx
   */
  async set(key, data, ctx) {
    const { revalidate, tags = [] } = ctx;

    const entry = {
      value: data,
      lastModified: Date.now(),
      tags
    };

    const serialized = JSON.stringify(entry, replacer);
    const cacheKey = `${CACHE_PREFIX}${key}`;

    try {
      const pipeline = this.redis.pipeline();

      if (typeof revalidate === "number" && revalidate > 0) {
        pipeline.setex(cacheKey, revalidate, serialized);
      } else {
        // revalidate: false means cache indefinitely
        pipeline.set(cacheKey, serialized);
      }

      for (const tag of tags) {
        pipeline.sadd(`${TAGS_PREFIX}${tag}`, key);
      }

      await pipeline.exec();
    } catch (err) {
      console.error("[cache-handler] set error:", err.message);
    }
  }

  /**
   * @param {string | string[]} tags
   */
  async revalidateTag(tags) {
    const tagList = Array.isArray(tags) ? tags : [tags];

    try {
      for (const tag of tagList) {
        const tagKey = `${TAGS_PREFIX}${tag}`;
        const keys = await this.redis.smembers(tagKey);

        if (keys.length > 0) {
          const pipeline = this.redis.pipeline();
          for (const k of keys) {
            pipeline.del(`${CACHE_PREFIX}${k}`);
          }
          pipeline.del(tagKey);
          await pipeline.exec();
        } else {
          await this.redis.del(tagKey);
        }
      }
    } catch (err) {
      console.error("[cache-handler] revalidateTag error:", err.message);
    }
  }
}

export default CacheHandler;
