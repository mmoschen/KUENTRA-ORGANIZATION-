import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

type RateLimitEntry = { count: number; resetAt: number };

@Injectable()
export class RateLimitService {
  private readonly entries = new Map<string, RateLimitEntry>();

  assertAllowed(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const current = this.entries.get(key);
    const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;

    if (entry.count >= limit) {
      throw new HttpException("Demasiados intentos. Probá nuevamente más tarde.", HttpStatus.TOO_MANY_REQUESTS);
    }

    entry.count += 1;
    this.entries.set(key, entry);

    if (this.entries.size > 10_000) {
      for (const [entryKey, value] of this.entries) {
        if (value.resetAt <= now) this.entries.delete(entryKey);
      }
    }
  }
}
