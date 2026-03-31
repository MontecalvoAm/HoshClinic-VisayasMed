import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_for_development_only";

/**
 * Hashes a plain text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Role-Based Access Control (RBAC) definitions
 */
export type UserRole = 'Super Admin' | 'Admin' | 'Doctor' | 'Staff' | 'Patient';

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
}

/**
 * Permissions mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Super Admin': ['*'],
  'Admin': ['*'],
  'Doctor': ['view_patients', 'edit_emr', 'view_appointments', 'manage_schedule'],
  'Staff': ['view_appointments', 'manage_appointments', 'view_billing', 'manage_billing'],
  'Patient': ['view_own_emr', 'book_appointment'],
};

/**
 * Check if a user has a specific permission based on their role.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  if (role === 'Super Admin' || role === 'Admin') return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Verify a JWT token and return session data.
 */
export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (error) {
    return null;
  }
}
