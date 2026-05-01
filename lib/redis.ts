// HoshClinic/lib/redis.ts
import { Redis } from '@upstash/redis';

// Ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set in environment variables
// These are available from your Upstash console.
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be defined in production environment.');
  } else {
    console.warn('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set. Rate limiting will not be distributed in development.');
  }
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '', // Fallback for dev warning
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '', // Fallback for dev warning
});
