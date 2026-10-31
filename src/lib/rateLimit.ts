import { NextRequest } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory, so limits apply per server instance. That is enough to slow down
// casual abuse on a small site; a shared store would be needed for strict limits.
const buckets = new Map<string, Bucket>();

export function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}

/** Records a hit and returns false once `limit` hits land inside the window. */
export function hit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}

export function isLimited(key: string, limit: number): boolean {
  const bucket = buckets.get(key);
  return !!bucket && bucket.resetAt > Date.now() && bucket.count >= limit;
}

export function clearLimit(key: string): void {
  buckets.delete(key);
}
