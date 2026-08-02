import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { verifyAdminPassword } from "@/lib/auth/password";
import { adminLoginSchema } from "@/lib/auth/validation";

const DUMMY_PASSWORD_HASH = "$2b$12$CHpRhOUJ6hLiYLr/PO1YAu7gUx2ekLY0AcXGmi1yfzZa3HB.ylEBu";
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true",
  session: { strategy: "jwt", maxAge: 8 * 60 * 60, updateAge: 15 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
        const passwordMatches = await verifyAdminPassword(parsed.data.password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);
        const now = new Date();

        if (!admin || !admin.isActive || (admin.lockedUntil && admin.lockedUntil > now)) return null;

        if (!passwordMatches) {
          const failedLoginAttempts = admin.failedLoginAttempts + 1;
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: {
              failedLoginAttempts,
              lockedUntil: failedLoginAttempts >= MAX_FAILED_ATTEMPTS ? new Date(now.getTime() + LOCK_DURATION_MS) : null,
            },
          });
          return null;
        }

        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: now },
        });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          sessionVersion: admin.sessionVersion,
          mustChangePassword: admin.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
        token.sessionVersion = user.sessionVersion;
        token.mustChangePassword = user.mustChangePassword;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.adminId ?? "");
        session.user.sessionVersion = Number(token.sessionVersion ?? -1);
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
      }
      return session;
    },
  },
});
