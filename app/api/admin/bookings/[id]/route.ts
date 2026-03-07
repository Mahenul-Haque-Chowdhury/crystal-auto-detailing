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

// PATCH /api/admin/bookings/[id] — update booking status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validStatuses = ["new", "confirmed", "completed", "cancelled"];
  if (!body.status || !validStatuses.includes(body.status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const table = getBookingsTableName();

  const { data, error } = await supabase
    .from(table)
    .update({ status: body.status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
