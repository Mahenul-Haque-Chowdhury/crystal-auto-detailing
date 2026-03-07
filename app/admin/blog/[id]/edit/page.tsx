"use client";

import { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import RichTextEditor from "@/components/RichTextEditor";
import { Save, Eye, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author: string;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
}

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((res) => res.json())
      .then((data: { post?: BlogPost }) => {
        if (data.post) {
          setPost(data.post);
          setTitle(data.post.title);
          setExcerpt(data.post.excerpt ?? "");
          setContent(data.post.content);
          setCoverImage(data.post.cover_image ?? "");
          setAuthor(data.post.author);
          setSlug(data.post.slug);
          setMetaTitle(data.post.meta_title ?? "");
          setMetaDescription(data.post.meta_description ?? "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = useCallback(
    async (status?: "draft" | "published") => {
      if (!title.trim()) {
        alert("Title is required");
        return;
      }
      setSaving(true);
      try {
        const body: Record<string, unknown> = {
          title,
          content,
          excerpt,
          cover_image: coverImage,
          author,
          slug,
          meta_title: metaTitle,
          meta_description: metaDescription,
        };
        if (status) body.status = status;

        const res = await fetch(`/api/admin/blog/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = (await res.json()) as { post?: BlogPost };
          if (data.post) setPost(data.post);
          alert("Post saved!");
        } else {
          const data = (await res.json()) as { error?: string };
          alert(data.error || "Failed to save");
        }
      } catch {
        alert("Network error");
      } finally {
        setSaving(false);
      }
    },
    [title, content, excerpt, coverImage, author, slug, metaTitle, metaDescription, id]
  );

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      router.push("/admin/blog");
    } catch {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  if (!post) {
    return (
      <AdminShell>
        <div className="py-20 text-center">
          <p className="text-slate-400">Post not found.</p>
          <Link href="/admin/blog" className="mt-4 inline-block text-gold-400">
            ← Back to posts
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Post</h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                post.status === "published"
                  ? "bg-green-400/10 text-green-400"
                  : "bg-yellow-400/10 text-yellow-400"
              }`}
            >
              {post.status}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-400/10"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-300 disabled:opacity-50"
            >
              <Eye size={16} />
              Publish
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xl font-bold text-white placeholder-slate-500 outline-none transition focus:border-gold-400"
        />

        {/* Excerpt */}
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt / summary (optional)"
          rows={2}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-gold-400"
        />

        {/* Rich Text Editor */}
        {content !== undefined && (
          <RichTextEditor content={content} onChange={setContent} />
        )}

        {/* Settings */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* SEO */}
        <details className="rounded-xl border border-white/10 bg-white/5 p-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-300">
            SEO Settings (optional)
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </details>
      </div>
    </AdminShell>
  );
}
