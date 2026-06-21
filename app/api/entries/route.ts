import { NextRequest, NextResponse } from "next/server";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  QUERY_DATE_FROM,
  QUERY_DATE_TO,
  QUERY_SORT,
  SORT_ASC,
  SORT_DESC,
  WORK_LOG_DATE_COLUMN,
  WORK_LOG_TABLE,
} from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateWorkLogEntry } from "@/lib/validateWorkLogEntry";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dateFrom = searchParams.get(QUERY_DATE_FROM);
  const dateTo = searchParams.get(QUERY_DATE_TO);
  const sort =
    searchParams.get(QUERY_SORT) === SORT_ASC ? SORT_ASC : SORT_DESC;

  const supabase = createSupabaseServerClient();

  let query = supabase.from(WORK_LOG_TABLE).select("*");

  if (dateFrom) {
    query = query.gte(WORK_LOG_DATE_COLUMN, dateFrom);
  }
  if (dateTo) {
    query = query.lte(WORK_LOG_DATE_COLUMN, dateTo);
  }

  query = query.order(WORK_LOG_DATE_COLUMN, { ascending: sort === SORT_ASC });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: HTTP_SERVER_ERROR }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
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
    .insert(validation.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: HTTP_SERVER_ERROR }
    );
  }

  return NextResponse.json(data, { status: HTTP_CREATED });
}
