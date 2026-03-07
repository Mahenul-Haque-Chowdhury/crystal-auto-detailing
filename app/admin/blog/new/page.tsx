"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import RichTextEditor from "@/components/RichTextEditor";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("Crystal Valley Auto Detail");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(
    async (status: "draft" | "published") => {
      if (!title.trim()) {
        alert("Title is required");
        return;
      }
      setSaving(true);
      try {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            excerpt,
            cover_image: coverImage,
            author,
            status,
            meta_title: metaTitle,
            meta_description: metaDescription,
            slug,
          }),
        });

        if (res.ok) {
          router.push("/admin/blog");
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
    [title, content, excerpt, coverImage, author, metaTitle, metaDescription, slug, router]
  );

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
            <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
          </div>
          <div className="flex gap-2">
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
        <RichTextEditor content={content} onChange={setContent} />

        {/* Sidebar settings */}
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
              Custom Slug (optional)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* SEO Section */}
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
                placeholder="Custom title for search engines"
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
                placeholder="Custom description for search engines"
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
