import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "./lib/security"; // Assuming your UserRole type is here

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      fullName: string;
      accessToken?: string; // Supabase access token
    } & DefaultSession["user"];
    accessToken?: string; // Supabase access token
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
    fullName: string;
    accessToken?: string; // Supabase access token
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    fullName: string;
    accessToken?: string; // Supabase access token
  }
}
