import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User { sessionVersion: number; mustChangePassword: boolean }
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; sessionVersion: number; mustChangePassword: boolean };
  }
}

declare module "next-auth/jwt" {
  interface JWT { adminId?: string; sessionVersion?: number; mustChangePassword?: boolean }
}
