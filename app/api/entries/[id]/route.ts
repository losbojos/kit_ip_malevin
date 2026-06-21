import { NextRequest, NextResponse } from "next/server";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_SERVER_ERROR,
  MSG_ENTRY_NOT_FOUND,
  WORK_LOG_TABLE,
} from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateWorkLogEntry } from "@/lib/validateWorkLogEntry";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id?.trim()) {
    return NextResponse.json(
      { error: "Не указан идентификатор записи" },
      { status: HTTP_BAD_REQUEST }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: HTTP_BAD_REQUEST });
  }

  const validation = validateWorkLogEntry(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error },
      { status: HTTP_BAD_REQUEST }
    );
  }

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(WORK_LOG_TABLE)
    .update(validation.data)
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
      { error: MSG_ENTRY_NOT_FOUND },
      { status: HTTP_NOT_FOUND }
    );
  }

  return NextResponse.json(data, { status: HTTP_OK });

}

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
      { error: MSG_ENTRY_NOT_FOUND },
      { status: HTTP_NOT_FOUND }
    );
  }

  return NextResponse.json(data);
}
