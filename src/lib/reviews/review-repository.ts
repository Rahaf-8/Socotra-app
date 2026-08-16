import "server-only";

import { randomUUID } from "node:crypto";

import type { ReviewStatus } from "@/generated/prisma/enums";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import type { ReviewInput } from "@/lib/validation/review";
import type { Review, ReviewsSummaryData } from "@/types/review";

const publicReviewSelect = {
  id: true,
  name: true,
  rating: true,
  message: true,
  createdAt: true,
} as const;

const adminReviewSelect = {
  id: true,
  name: true,
  email: true,
  rating: true,
  message: true,
  locale: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getApprovedReviews(locale: Locale): Promise<{ reviews: Review[]; summary: ReviewsSummaryData }> {
  const [rows, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { status: "approved", locale },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 3,
      select: publicReviewSelect,
    }),
    prisma.review.aggregate({
      where: { status: "approved", locale },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  return {
    reviews: rows,
    summary: {
      averageRating: aggregate._avg.rating ?? 0,
      totalReviewCount: aggregate._count._all,
    },
  };
}

export function getAdminReviews(status?: ReviewStatus) {
  return prisma.review.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 100,
    select: adminReviewSelect,
  });
}

export function getAdminReview(id: string) {
  return prisma.review.findUnique({ where: { id }, select: adminReviewSelect });
}

export async function createPendingReview(input: ReviewInput, locale: Locale) {
  const duplicateSince = new Date(Date.now() - 2 * 60 * 1000);
  const duplicate = await prisma.review.findFirst({
    where: {
      name: input.name,
      email: input.email,
      rating: input.rating,
      message: input.message,
      locale,
      createdAt: { gte: duplicateSince },
    },
    select: { id: true },
  });

  if (duplicate) return { id: duplicate.id, duplicate: true } as const;

  const review = await prisma.review.create({
    data: {
      id: `review-${randomUUID()}`,
      name: input.name,
      email: input.email,
      rating: input.rating,
      message: input.message,
      locale,
      status: "pending",
    },
    select: { id: true },
  });
  return { id: review.id, duplicate: false } as const;
}
