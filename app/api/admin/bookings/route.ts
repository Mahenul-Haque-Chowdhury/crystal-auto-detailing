import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin, getBookingsTableName } from "@/lib/supabaseAdmin";
import { isValidToken } from "@/lib/adminTokens";

export const runtime = "nodejs";

async function requireAdmin(): Promise<true | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || !isValidToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return true;
}

// GET /api/admin/bookings — list all bookings with optional filters
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const supabase = getSupabaseAdmin();
  const table = getBookingsTableName();

  let query = supabase
    .from(table)
    .select("id, full_name, phone, service, car_type, address, requested_datetime, remarks, status, created_at")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
