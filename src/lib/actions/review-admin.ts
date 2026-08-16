"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { reviewIdSchema, reviewStatusSchema } from "@/lib/validation/review";

function revalidateReviews() {
  for (const path of ["/admin/reviews", "/admin/dashboard", "/en", "/ar"]) revalidatePath(path);
}

function moderationDestination(id: string, detail: boolean, result: string) {
  return detail
    ? `/admin/reviews/${id}?result=${result}`
    : `/admin/reviews?result=${result}`;
}

export async function moderateReview(formData: FormData) {
  await requireAdmin();
  const id = reviewIdSchema.safeParse(String(formData.get("id") ?? ""));
  const status = reviewStatusSchema.safeParse(String(formData.get("status") ?? ""));
  if (!id.success || !status.success) redirect("/admin/reviews?result=invalid");
  const detail = formData.get("detail") === "1";

  let count = 0;
  try {
    count = (await prisma.review.updateMany({ where: { id: id.data }, data: { status: status.data } })).count;
  } catch {
    redirect(moderationDestination(id.data, detail, "error"));
  }
  revalidateReviews();
  revalidatePath(`/admin/reviews/${id.data}`);
  redirect(moderationDestination(id.data, detail, count ? status.data : "missing"));
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = reviewIdSchema.safeParse(String(formData.get("id") ?? ""));
  if (!id.success || formData.get("confirm") !== "on") redirect("/admin/reviews?result=confirmation-required");

  let count = 0;
  try {
    count = (await prisma.review.deleteMany({ where: { id: id.data } })).count;
  } catch {
    redirect("/admin/reviews?result=error");
  }
  revalidateReviews();
  revalidatePath(`/admin/reviews/${id.data}`);
  redirect(`/admin/reviews?result=${count ? "deleted" : "missing"}`);
}
