import { z } from "zod";

import { isStrongPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

const normalizedEmail = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(1).max(PASSWORD_MAX_LENGTH);

export const adminLoginSchema = z.object({ email: normalizedEmail, password });

export const adminBootstrapSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: normalizedEmail,
  password: z.string().refine(isStrongPassword, {
    message: `Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters and include uppercase, lowercase, number, and symbol characters.`,
  }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: password,
    newPassword: z.string().refine(isStrongPassword, {
      message: `Use ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters with uppercase, lowercase, number, and symbol characters.`,
    }),
    confirmPassword: z.string(),
  })
  .superRefine((values, context) => {
    if (values.newPassword !== values.confirmPassword) {
      context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match." });
    }
    if (values.newPassword === values.currentPassword) {
      context.addIssue({ code: "custom", path: ["newPassword"], message: "Choose a password different from your current password." });
    }
  });

export function safeAdminDestination(value: unknown) {
  return typeof value === "string" && value.startsWith("/admin") && !value.startsWith("//") && value !== "/admin/login"
    ? value
    : "/admin";
}
