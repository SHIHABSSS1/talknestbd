import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { toReview } from "@/lib/review-api";
import { reviewUpdateSchema } from "@/lib/review-schema";

async function guardRequest(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  return rejectCrossSite(request);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = await guardRequest(request);
  if (blocked) return blocked;

  const { id } = await params;
  if (!id || id.length > 80) return jsonError("Invalid review id.", 400);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = reviewUpdateSchema.safeParse({ ...(payload as object), id });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return jsonError(issue ? `${issue.path.join(".")} — ${issue.message}` : "Invalid update.", 400);
  }

  const [existing] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  if (!existing) return jsonError("Review not found.", 404);

  const patch = parsed.data;
  const status = patch.status ?? (existing.status as "pending" | "approved" | "rejected");
  const wantsPin = patch.pinned ?? existing.pinned;
  if (wantsPin && status !== "approved") {
    return jsonError("Only approved reviews can be pinned.", 400);
  }

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.status) update.status = patch.status;
  if (patch.pinned !== undefined) update.pinned = status === "approved" ? patch.pinned : false;
  if (patch.title !== undefined) update.title = patch.title;
  if (patch.text !== undefined) update.text = patch.text;
  if (patch.rating !== undefined) update.rating = patch.rating;
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.location !== undefined) update.location = patch.location;
  if (patch.verified !== undefined) update.verified = patch.verified;
  if (patch.reply !== undefined) {
    const reply = patch.reply?.trim() || null;
    update.reply = reply;
    update.replyDate = reply ? new Date() : null;
  }

  try {
    const [row] = await db
      .update(reviews)
      .set(update)
      .where(eq(reviews.id, id))
      .returning();
    return NextResponse.json({ review: toReview(row) });
  } catch (error) {
    console.error("[admin reviews] update failed:", error);
    return jsonError("Could not update the review.", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = await guardRequest(request);
  if (blocked) return blocked;
  const { id } = await params;
  if (!id || id.length > 80) return jsonError("Invalid review id.", 400);

  await db.delete(reviews).where(eq(reviews.id, id));
  return NextResponse.json({ ok: true });
}
