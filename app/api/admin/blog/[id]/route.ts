import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
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

// GET /api/admin/blog/[id] — single post
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post: data });
}

// PUT /api/admin/blog/[id] — update post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowedFields = [
    "title", "slug", "content", "excerpt", "cover_image",
    "status", "author", "meta_title", "meta_description",
  ];

  const updateData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) {
      updateData[key] = body[key];
    }
  }

  // Auto-set published_at when publishing for the first time
  if (updateData.status === "published") {
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("published_at")
      .eq("id", id)
      .single();

    if (existing && !existing.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
