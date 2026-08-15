type Entry = { attempts: number; resetAt: number };

const entries = new Map<string, Entry>();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 5;

function getEntry(key: string, now: number) {
  const current = entries.get(key);
  if (!current || current.resetAt <= now) {
    const fresh = { attempts: 0, resetAt: now + windowMs };
    entries.set(key, fresh);
    return fresh;
  }
  return current;
}

export function getClientAddress(request: Request) {
  return request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export function checkLoginRateLimit(key: string) {
  const entry = getEntry(key, Date.now());
  return { allowed: entry.attempts < maxAttempts, retryAfter: Math.ceil((entry.resetAt - Date.now()) / 1000) };
}

export function recordLoginFailure(key: string) {
  const entry = getEntry(key, Date.now());
  entry.attempts += 1;
}

export function clearLoginFailures(key: string) {
  entries.delete(key);
}