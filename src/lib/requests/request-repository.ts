import "server-only";

import type { BookingRequestStatus, ContactRequestStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

const pageSize = 100;

export function getAdminBookingRequests(status?: BookingRequestStatus) {
  return prisma.bookingRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: pageSize,
    select: { id: true, fullName: true, email: true, whatsappNumber: true, selectedPackageTitle: true, preferredArrivalDate: true, adults: true, children: true, locale: true, status: true, createdAt: true },
  });
}

export function getAdminBookingRequest(id: string) {
  return prisma.bookingRequest.findUnique({
    where: { id },
    select: { id: true, tourId: true, selectedPackageTitle: true, fullName: true, email: true, whatsappNumber: true, country: true, preferredArrivalDate: true, adults: true, children: true, specialRequirements: true, internalNotes: true, locale: true, status: true, createdAt: true, updatedAt: true, tour: { select: { slug: true, translations: { select: { locale: true, title: true } } } } },
  });
}

export function getAdminContactRequests(status?: ContactRequestStatus) {
  return prisma.contactRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: pageSize,
    select: { id: true, name: true, email: true, enquiryValue: true, subject: true, message: true, locale: true, status: true, createdAt: true, enquiryType: { select: { translations: { select: { locale: true, label: true } } } } },
  });
}

export function getAdminContactRequest(id: string) {
  return prisma.contactRequest.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, enquiryTypeId: true, enquiryValue: true, subject: true, message: true, internalNotes: true, locale: true, status: true, createdAt: true, updatedAt: true, enquiryType: { select: { status: true, translations: { select: { locale: true, label: true } } } } },
  });
}

export function getNewRequestCounts() {
  return Promise.all([
    prisma.bookingRequest.count({ where: { status: "new" } }),
    prisma.contactRequest.count({ where: { status: "new" } }),
  ]);
}
