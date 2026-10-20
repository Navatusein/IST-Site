interface IAttempts {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private readonly attempts = new Map<string, IAttempts>();

  constructor(private readonly maxAttempts: number, private readonly windowMs: number) {
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

    if (!attempts || attempts.resetAt <= now)
      this.attempts.set(key, {count: 1, resetAt: now + this.windowMs});
    else
      attempts.count++;

    if (this.attempts.size > 10000)
      this.removeExpired(now);
  }

  public reset(key: string): void {
    this.attempts.delete(key);
  }

  private removeExpired(now: number): void {
    for (const [key, attempts] of this.attempts) {
      if (attempts.resetAt <= now)
        this.attempts.delete(key);
    }
  }
}
