import { NextRequest, NextResponse } from "next/server";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  MIN_VOLUME,
  QUERY_DATE_FROM,
  QUERY_DATE_TO,
  QUERY_SORT,
  SORT_ASC,
  SORT_DESC,
  WORK_LOG_DATE_COLUMN,
  WORK_LOG_TABLE,
} from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

type CreateEntryBody = {
  work_date?: string;
  activity?: string;
  volume?: number;
  unit?: string;
  executor?: string;
};

export async function POST(request: NextRequest) {
  let body: CreateEntryBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: HTTP_BAD_REQUEST });
  }

  const { work_date, activity, volume, unit, executor } = body;

  if (!work_date?.trim()) {
    return NextResponse.json(
      { error: "work_date is required" },
      { status: HTTP_BAD_REQUEST }
    );
  }
  if (!activity?.trim()) {
    return NextResponse.json(
      { error: "activity is required" },
      { status: HTTP_BAD_REQUEST }
    );
  }
  if (!unit?.trim()) {
    return NextResponse.json(
      { error: "unit is required" },
      { status: HTTP_BAD_REQUEST }
    );
  }
  if (!executor?.trim()) {
    return NextResponse.json(
      { error: "executor is required" },
      { status: HTTP_BAD_REQUEST }
    );
  }
  if (typeof volume !== "number" || volume <= MIN_VOLUME) {
    return NextResponse.json(
      { error: "volume must be a number greater than 0" },
      { status: HTTP_BAD_REQUEST }
    );
  }

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(WORK_LOG_TABLE)
    .insert({
      work_date: work_date.trim(),
      activity: activity.trim(),
      volume,
      unit: unit.trim(),
      executor: executor.trim(),
    })
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
