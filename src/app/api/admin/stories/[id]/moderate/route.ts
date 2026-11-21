import { NextResponse } from "next/server";

import { moderateStory } from "@/lib/actions/stories";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { storyModerateSchema } from "@/lib/story-schema";

/** Admin accept / reject / publish / unpublish. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = storyModerateSchema.safeParse({ ...(payload as object), id });
  if (!parsed.success) return jsonError("Invalid moderation request.", 400);
  const result = await moderateStory(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
