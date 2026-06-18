import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

  const supabase = createSupabaseServerClient();

  let query = supabase.from("work_log").select("*");

  if (dateFrom) {
    query = query.gte("work_date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("work_date", dateTo);
  }

  query = query.order("work_date", { ascending: sort === "asc" });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { work_date, activity, volume, unit, executor } = body;

  if (!work_date?.trim()) {
    return NextResponse.json({ error: "work_date is required" }, { status: 400 });
  }
  if (!activity?.trim()) {
    return NextResponse.json({ error: "activity is required" }, { status: 400 });
  }
  if (!unit?.trim()) {
    return NextResponse.json({ error: "unit is required" }, { status: 400 });
  }
  if (!executor?.trim()) {
    return NextResponse.json({ error: "executor is required" }, { status: 400 });
  }
  if (typeof volume !== "number" || volume <= 0) {
    return NextResponse.json(
      { error: "volume must be a number greater than 0" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("work_log")
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}