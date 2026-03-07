import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin, getDiscountsTableName } from "@/lib/supabaseAdmin";
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

// GET /api/admin/discounts — list all discount leads
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();

  const supabase = getSupabaseAdmin();
  const table = getDiscountsTableName();

  let query = supabase
    .from(table)
    .select("id, name, phone, car_model, discount, created_at")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,car_model.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data });
}
