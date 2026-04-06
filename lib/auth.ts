import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'secret-key-change-this';

export const hashPassword = (password: string): string => {
  return crypto
    .createHash('sha256')
    .update(password + SESSION_SECRET)
    .digest('hex');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const generateSessionToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
