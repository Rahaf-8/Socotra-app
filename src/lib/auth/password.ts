import "server-only";

import { compare, hash, truncates } from "bcryptjs";

export const PASSWORD_MIN_LENGTH = 14;
export const PASSWORD_MAX_LENGTH = 72;
const BCRYPT_COST = 12;

export function isStrongPassword(password: string) {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH &&
    !truncates(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function hashAdminPassword(password: string) {
  return hash(password, BCRYPT_COST);
}

export function verifyAdminPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}
