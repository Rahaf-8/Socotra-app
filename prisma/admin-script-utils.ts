import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { compare, hash, truncates } from "bcryptjs";
import { z } from "zod";

import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const adminPrisma = new PrismaClient({
  adapter,
});

export const adminInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(14)
    .max(72)
    .refine(
      (value) =>
        !truncates(value) &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /\d/.test(value) &&
        /[^A-Za-z0-9]/.test(value),
      {
        message:
          "Password must include uppercase, lowercase, number, and symbol characters and fit within bcrypt's 72-byte limit.",
      },
    ),
});

export const resetInputSchema = adminInputSchema.pick({
  email: true,
  password: true,
});

export const hashPassword = (password: string) => hash(password, 12);
export const comparePassword = compare;