import { createClient } from "redis";

export class CacheService {
  private client: ReturnType<typeof createClient>;
  private ttl = 60; // 60 seconds

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST || "localhost"}:6379`,
    });
    this.client.connect();
  }

  async set(key: string, value: Buffer): Promise<void> {
    await this.client.setEx(key, this.ttl, value.toString("base64"));
  }

  async get(key: string): Promise<Buffer | null> {
    const result = await this.client.get(key);
    return result ? Buffer.from(result, "base64") : null;
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}
