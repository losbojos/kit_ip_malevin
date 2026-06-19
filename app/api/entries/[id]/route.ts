import { NextRequest, NextResponse } from "next/server";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_SERVER_ERROR,
  WORK_LOG_TABLE,
} from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id?.trim()) {
    return NextResponse.json(
      { error: "Не указан идентификатор записи" },
      { status: HTTP_BAD_REQUEST }
    );
  }

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(WORK_LOG_TABLE)
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: HTTP_SERVER_ERROR }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Запись не найдена" },
      { status: HTTP_NOT_FOUND }
    );
  }

  return NextResponse.json(data);
}
