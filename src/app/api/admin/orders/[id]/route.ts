import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { jsonError, getAdminContext, rejectCrossSite } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

const statusSchema = z.object({
  status: z.enum([
    "Confirmed",
    "Processing",
    "Out for delivery",
    "confirmed",
    "processing",
    "out_for_delivery",
  ]),
});

function toDbStatus(status: z.infer<typeof statusSchema>["status"]): string {
  const value = status.toLowerCase().replace(/[\s-]+/g, "_");
  if (value === "out_for_delivery" || value === "outfordelivery") {
    return "out_for_delivery";
  }
  return value;
}

/** Admin status update. Server owns the canonical lowercase status value. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  const { id } = await params;
  if (!id || id.length > 80) return jsonError("Invalid order id.", 400);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = statusSchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid status.", 400);

  const [row] = await db
    .update(orders)
    .set({ status: toDbStatus(parsed.data.status), updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();

  if (!row) return jsonError("Order not found.", 404);
  return NextResponse.json({ id: row.id, status: row.status });
}
