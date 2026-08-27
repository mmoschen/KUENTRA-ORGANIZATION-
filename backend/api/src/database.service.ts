import { Injectable, OnModuleDestroy, ServiceUnavailableException } from "@nestjs/common";
import { Pool, type QueryResultRow } from "pg";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool?: Pool;

  constructor() {
    if (process.env.DATABASE_URL) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30_000,
      });
    }
  }

  async query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
    if (!this.pool) {
      throw new ServiceUnavailableException("El sistema de opiniones todavía no está configurado.");
    }
    return this.pool.query<T>(text, values);
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }
}
