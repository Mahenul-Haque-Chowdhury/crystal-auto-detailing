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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// GET /api/admin/blog — list all posts (admin sees drafts too)
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // 'draft' | 'published' | null (all)

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, status, author, created_at, updated_at, published_at, cover_image")
    .order("created_at", { ascending: false });

  if (status === "draft" || status === "published") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data });
}

// POST /api/admin/blog — create a new post
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  let body: {
    title?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    status?: string;
    author?: string;
    meta_title?: string;
    meta_description?: string;
    slug?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, content, excerpt, cover_image, status, author, meta_title, meta_description } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug?.trim()
    ? slugify(body.slug.trim())
    : slugify(title) + "-" + Date.now().toString(36);

  const postData: Record<string, unknown> = {
    title: title.trim(),
    slug,
    content: content || "",
    excerpt: excerpt?.trim() || null,
    cover_image: cover_image?.trim() || null,
    status: status === "published" ? "published" : "draft",
    author: author?.trim() || "Crystal Valley Auto Detail",
    meta_title: meta_title?.trim() || null,
    meta_description: meta_description?.trim() || null,
  };

  if (postData.status === "published") {
    postData.published_at = new Date().toISOString();
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(postData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
