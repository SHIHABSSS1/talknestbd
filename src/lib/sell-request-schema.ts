/** Runtime validation for the public sell-request API. */
import { z } from "zod";

export const createSellRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional(),
  address: z.string().trim().min(1).max(500),
  bookTitle: z.string().trim().min(1).max(200),
  purchasePrice: z.number().finite().min(0).max(1_000_000),
  condition: z.string().trim().min(1).max(120),
  rate: z.number().finite().min(0).max(100),
  amount: z.number().finite().min(0).max(1_000_000),
});

export const updateSellRequestSchema = z.object({
  id: z.string().trim().min(1).max(80),
  status: z.enum(["New", "Contacted", "Completed"]).optional(),
  adminNote: z.string().trim().max(500).optional(),
});

export const deleteSellRequestSchema = z.object({
  id: z.string().trim().min(1).max(80),
});
