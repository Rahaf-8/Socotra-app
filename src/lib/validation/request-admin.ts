import { z } from "zod";

const requestId = z.string().trim().min(1).max(120).regex(/^[A-Za-z0-9_-]+$/);
const internalNotes = z.string().trim().max(5_000);

export const bookingRequestUpdateSchema = z.object({
  id: requestId,
  status: z.enum(["new", "reviewing", "contacted", "confirmed", "declined", "archived"]),
  internalNotes,
});

export const contactRequestUpdateSchema = z.object({
  id: requestId,
  status: z.enum(["new", "inProgress", "resolved", "archived"]),
  internalNotes,
});

export const bookingRequestFilterSchema = z.enum(["all", "new", "reviewing", "contacted", "confirmed", "declined", "archived"]);
export const contactRequestFilterSchema = z.enum(["all", "new", "inProgress", "resolved", "archived"]);
