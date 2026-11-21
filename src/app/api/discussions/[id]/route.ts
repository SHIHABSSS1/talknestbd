import { NextResponse } from "next/server";

import { deleteDiscussion } from "@/lib/actions/video-quiz";
import { rejectCrossSite } from "@/lib/admin-api";
import { idSchema } from "@/lib/video-quiz-schema";

/** Readers may delete their own comment; admins may delete any. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  const parsed = idSchema.safeParse({ id });
  if (!parsed.success) return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  const result = await deleteDiscussion(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
