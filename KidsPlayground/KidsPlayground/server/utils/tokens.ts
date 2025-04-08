import crypto from 'crypto';

/**
 * Generate a random token for email verification or password reset
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Calculate an expiration time in the future
 * @param hours Number of hours in the future
 * @returns Date object representing the expiration time
 */
export function calculateExpiryTime(hours: number = 1): Date {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}