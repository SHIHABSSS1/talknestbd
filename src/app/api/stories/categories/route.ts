import { NextResponse, connection } from "next/server";

import { getCategoryNames, listCategories } from "@/lib/db/queries/stories";

/** Categories used by published stories, plus admin-managed categories. */
export async function GET(request: Request) {
  await connection();
  const [names, categories] = await Promise.all([getCategoryNames(), listCategories()]);
  return NextResponse.json({ categories: names, managed: categories });
}
