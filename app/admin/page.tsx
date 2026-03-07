"use client";

import AdminShell from "@/components/AdminShell";
import Link from "next/link";
import { FileText, PlusCircle, Eye, CalendarCheck, Percent, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface DashStats {
  blogTotal: number;
  published: number;
  drafts: number;
  bookingsNew: number;
  bookingsTotal: number;
  leadsTotal: number;
}

export default function AdminDashboard() {
  const [s, setS] = useState<DashStats>({
    blogTotal: 0, published: 0, drafts: 0,
    bookingsNew: 0, bookingsTotal: 0, leadsTotal: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/blog").then((r) => r.json()).catch(() => ({ posts: [] })),
      fetch("/api/admin/bookings").then((r) => r.json()).catch(() => ({ bookings: [] })),
      fetch("/api/admin/discounts").then((r) => r.json()).catch(() => ({ leads: [] })),
    ]).then(([blogData, bookingData, discountData]) => {
      const posts = (blogData as { posts?: { status: string }[] }).posts ?? [];
      const bookings = (bookingData as { bookings?: { status: string }[] }).bookings ?? [];
      const leads = (discountData as { leads?: unknown[] }).leads ?? [];
      setS({
        blogTotal: posts.length,
        published: posts.filter((p) => p.status === "published").length,
        drafts: posts.filter((p) => p.status === "draft").length,
        bookingsTotal: bookings.length,
        bookingsNew: bookings.filter((b) => b.status === "new").length,
        leadsTotal: leads.length,
      });
    });
  }, []);

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome to the Crystal Valley admin panel.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <CalendarCheck className="text-blue-400" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">{s.bookingsNew}</p>
            <p className="text-xs text-slate-400">New Bookings</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <CalendarCheck className="text-green-400" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">{s.bookingsTotal}</p>
            <p className="text-xs text-slate-400">Total Bookings</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <Percent className="text-gold-400" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">{s.leadsTotal}</p>
            <p className="text-xs text-slate-400">Discount Leads</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <FileText className="text-gold-400" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">{s.blogTotal}</p>
            <p className="text-xs text-slate-400">Blog Posts</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <Eye className="text-green-400" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">{s.published}</p>
            <p className="text-xs text-slate-400">Published</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <FileText className="text-yellow-400" size={22} />
            <p className="mt-2 text-2xl font-bold text-white">{s.drafts}</p>
            <p className="text-xs text-slate-400">Drafts</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/bookings"
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            <CalendarCheck size={16} />
            View Bookings {s.bookingsNew > 0 && `(${s.bookingsNew} new)`}
          </Link>
          <Link
            href="/admin/discounts"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <Users size={16} />
            Discount Leads
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-300"
          >
            <PlusCircle size={16} />
            New Blog Post
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <FileText size={16} />
            Manage Posts
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
