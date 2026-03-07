"use client";

import AdminShell from "@/components/AdminShell";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { PlusCircle, Edit3, Trash2, Eye, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  author: string;
  created_at: string;
  published_at: string | null;
  excerpt: string | null;
}

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "/api/admin/blog"
          : `/api/admin/blog?status=${filter}`;
      const res = await fetch(url);
      const data = (await res.json()) as { posts?: BlogPost[] };
      setPosts(data.posts ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your blog content
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-300"
          >
            <PlusCircle size={16} />
            New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-gold-400/15 text-gold-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Posts table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">No posts found.</p>
            <Link
              href="/admin/blog/new"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300"
            >
              <PlusCircle size={14} />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Title</th>
                  <th className="hidden px-4 py-3 md:table-cell">Status</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{post.title}</p>
                        {post.excerpt && (
                          <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {post.status === "published" ? (
                          <Eye size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {post.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-slate-400 lg:table-cell">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-400/10 hover:text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
