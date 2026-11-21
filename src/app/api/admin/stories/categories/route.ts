import { NextResponse } from "next/server";

import { createCategory } from "@/lib/actions/stories";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { listCategories } from "@/lib/db/queries/stories";
import { categorySchema } from "@/lib/story-schema";

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  return NextResponse.json({ categories: await listCategories() });
}

export async function POST(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = categorySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid category.", 400);
  const result = await createCategory(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
