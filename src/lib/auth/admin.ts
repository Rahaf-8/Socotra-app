import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, isActive: true, mustChangePassword: true, sessionVersion: true },
  });

  if (!admin?.isActive || admin.sessionVersion !== session.user.sessionVersion) return null;
  return { id: admin.id, name: admin.name, email: admin.email, mustChangePassword: admin.mustChangePassword };
}

export async function requireAdmin(options: { allowPasswordChange?: boolean } = {}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.mustChangePassword && !options.allowPasswordChange) redirect("/admin/change-password");
  return admin;
}
