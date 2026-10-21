interface IAttempts {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private readonly attempts = new Map<string, IAttempts>();

  constructor(private readonly maxAttempts: number, private readonly windowMs: number, private readonly maxKeys = 10000) {
  }

  public isLimited(key: string): boolean {
    const attempts = this.attempts.get(key);

    if (!attempts)
      return false;

    if (attempts.resetAt <= Date.now()) {
      this.attempts.delete(key);
      return false;
    }

    return attempts.count >= this.maxAttempts;
  }

  public registerFailure(key: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(key);

    if (attempts && attempts.resetAt > now) {
      attempts.count++;
      return;
    }

    this.attempts.delete(key);
    this.attempts.set(key, {count: 1, resetAt: now + this.windowMs});

    if (this.attempts.size > this.maxKeys)
      this.evict(now);
  }

  public reset(key: string): void {
    this.attempts.delete(key);
  }

  private evict(now: number): void {
    for (const [key, attempts] of this.attempts) {
      if (attempts.resetAt <= now)
        this.attempts.delete(key);
    }

    for (const key of this.attempts.keys()) {
      if (this.attempts.size <= this.maxKeys)
        break;

      this.attempts.delete(key);
    }
  }
}
