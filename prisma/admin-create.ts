import { adminInputSchema, adminPrisma, hashPassword } from "./admin-script-utils";

async function main() {
  const parsed = adminInputSchema.safeParse({ name: process.env.ADMIN_NAME, email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  if (!parsed.success) throw new Error(`Administrator bootstrap input is invalid: ${parsed.error.issues.map((issue) => issue.message).join(" ")}`);
  const existing = await adminPrisma.adminUser.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (existing) throw new Error("An administrator with this email already exists. Nothing was changed.");
  await adminPrisma.adminUser.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password), mustChangePassword: true },
    select: { id: true },
  });
  console.info("Administrator created. A password change is required at first login.");
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Administrator creation failed."); process.exitCode = 1; }).finally(() => adminPrisma.$disconnect());
