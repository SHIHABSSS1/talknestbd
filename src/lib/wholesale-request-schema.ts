/** Runtime validation for the public wholesale-request API. */
import { z } from "zod";

const quantity = z.enum(["10–25 copies", "26–50 copies", "51–100 copies", "100+ copies"]);

export const createWholesaleRequestSchema = z.object({
  organization: z.string().trim().min(2).max(160),
  contact: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional(),
  city: z.string().trim().min(1).max(120),
  quantity,
  message: z.string().trim().max(2000).default(""),
});

export const updateWholesaleRequestSchema = z.object({
  id: z.string().trim().min(1).max(80),
  status: z.enum(["New", "Contacted", "Completed"]).optional(),
  adminNote: z.string().trim().max(500).optional(),
});

export const deleteWholesaleRequestSchema = z.object({
  id: z.string().trim().min(1).max(80),
});
