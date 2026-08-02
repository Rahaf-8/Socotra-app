import { adminPrisma, hashPassword, resetInputSchema } from "./admin-script-utils";

async function main() {
  const parsed = resetInputSchema.safeParse({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  if (!parsed.success) throw new Error(`Password reset input is invalid: ${parsed.error.issues.map((issue) => issue.message).join(" ")}`);
  const existing = await adminPrisma.adminUser.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (!existing) throw new Error("No administrator exists with this email. Nothing was changed.");
  await adminPrisma.adminUser.update({
    where: { id: existing.id },
    data: { passwordHash: await hashPassword(parsed.data.password), mustChangePassword: true, passwordChangedAt: new Date(), sessionVersion: { increment: 1 }, failedLoginAttempts: 0, lockedUntil: null },
    select: { id: true },
  });
  console.info("Administrator password reset. Existing sessions are invalid and a password change is required at next login.");
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Administrator password reset failed."); process.exitCode = 1; }).finally(() => adminPrisma.$disconnect());
