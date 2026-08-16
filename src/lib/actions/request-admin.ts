"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { bookingRequestUpdateSchema, contactRequestUpdateSchema } from "@/lib/validation/request-admin";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export async function updateBookingRequest(formData: FormData) {
  await requireAdmin();
  const parsed = bookingRequestUpdateSchema.safeParse({ id: value(formData, "id"), status: value(formData, "status"), internalNotes: value(formData, "internalNotes") });
  if (!parsed.success) redirect(`/admin/booking-requests?result=invalid`);
  const result = await prisma.bookingRequest.updateMany({ where: { id: parsed.data.id }, data: { status: parsed.data.status, internalNotes: parsed.data.internalNotes || null } });
  revalidatePath("/admin/booking-requests");
  revalidatePath(`/admin/booking-requests/${parsed.data.id}`);
  revalidatePath("/admin/dashboard");
  redirect(result.count ? `/admin/booking-requests/${parsed.data.id}?saved=1` : "/admin/booking-requests?result=missing");
}

export async function updateContactRequest(formData: FormData) {
  await requireAdmin();
  const parsed = contactRequestUpdateSchema.safeParse({ id: value(formData, "id"), status: value(formData, "status"), internalNotes: value(formData, "internalNotes") });
  if (!parsed.success) redirect(`/admin/contact-requests?result=invalid`);
  const result = await prisma.contactRequest.updateMany({ where: { id: parsed.data.id }, data: { status: parsed.data.status, internalNotes: parsed.data.internalNotes || null } });
  revalidatePath("/admin/contact-requests");
  revalidatePath(`/admin/contact-requests/${parsed.data.id}`);
  revalidatePath("/admin/dashboard");
  redirect(result.count ? `/admin/contact-requests/${parsed.data.id}?saved=1` : "/admin/contact-requests?result=missing");
}
