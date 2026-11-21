import { NextResponse } from "next/server";

import { deleteCategory, updateCategory } from "@/lib/actions/stories";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { categorySchema, idSchema } from "@/lib/story-schema";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
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
  const parsed = categorySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid category.", 400);
  const result = await updateCategory({ ...parsed.data, id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  if (!idSchema.safeParse({ id }).success) return jsonError("Invalid category id.", 400);
  const result = await deleteCategory({ id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
