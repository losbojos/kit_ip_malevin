import { NextResponse } from "next/server";
import {
  HTTP_SERVER_ERROR,
  WORK_ACTIVITY_CATALOG_TABLE,
} from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(WORK_ACTIVITY_CATALOG_TABLE)
    .select("id, name")
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: HTTP_SERVER_ERROR }
    );
  }

  return NextResponse.json(data);
}
