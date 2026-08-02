"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { requireAdmin } from "@/lib/auth/admin";
import { hashAdminPassword, verifyAdminPassword } from "@/lib/auth/password";
import { adminLoginSchema, changePasswordSchema, safeAdminDestination } from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

export type AdminFormState = { error?: string; fieldErrors?: Record<string, string[]> };

export async function loginAdmin(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const parsed = adminLoginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Invalid email or password." };

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeAdminDestination(formData.get("callbackUrl")),
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Invalid email or password." };
    throw error;
  }
  return {};
}

export async function changeAdminPassword(_state: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin({ allowPasswordChange: true });
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const record = await prisma.adminUser.findUnique({ where: { id: admin.id }, select: { passwordHash: true } });
  if (!record || !(await verifyAdminPassword(parsed.data.currentPassword, record.passwordHash))) {
    return { error: "The current password is incorrect." };
  }

  const passwordHash = await hashAdminPassword(parsed.data.newPassword);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      passwordHash,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
      sessionVersion: { increment: 1 },
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
  await signOut({ redirect: false });
  redirect("/admin/login?passwordChanged=1");
}

export async function logoutAdmin() {
  await signOut({ redirectTo: "/admin/login" });
}
