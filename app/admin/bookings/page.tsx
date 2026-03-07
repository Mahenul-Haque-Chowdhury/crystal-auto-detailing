"use client";

import AdminShell from "@/components/AdminShell";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

interface Booking {
  id: string;
  full_name: string;
  phone: string;
  service: string;
  car_type: string;
  address: string;
  requested_datetime: string;
  remarks: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = ["all", "new", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-400/10 text-blue-400",
  confirmed: "bg-green-400/10 text-green-400",
  completed: "bg-gold-400/10 text-gold-400",
  cancelled: "bg-red-400/10 text-red-400",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = (await res.json()) as { bookings?: Booking[] };
      setBookings(data.bookings ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage customer booking requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "New", value: stats.new, color: "text-blue-400" },
            { label: "Confirmed", value: stats.confirmed, color: "text-green-400" },
            { label: "Completed", value: stats.completed, color: "text-gold-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                  filter === s
                    ? "bg-gold-400/15 text-gold-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
            />
          </div>

          <button
            onClick={fetchBookings}
            className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-white/10 bg-white/3 transition hover:bg-white/5"
              >
                {/* Main row */}
                <div
                  className="flex cursor-pointer items-center gap-4 px-4 py-3"
                  onClick={() =>
                    setExpandedId(expandedId === booking.id ? null : booking.id)
                  }
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{booking.full_name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status] ?? "bg-white/10 text-slate-400"}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {booking.phone}
                      </span>
                      <span>{booking.service} · {booking.car_type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />{" "}
                        {new Date(booking.requested_datetime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status changer */}
                  <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      disabled={updatingId === booking.id}
                      className="appearance-none rounded-lg border border-white/10 bg-white/5 py-1.5 pl-3 pr-8 text-xs font-medium text-white outline-none transition focus:border-gold-400 disabled:opacity-50"
                    >
                      <option value="new">New</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === booking.id && (
                  <div className="border-t border-white/5 px-4 py-3">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500">Address</p>
                        <p className="mt-0.5 flex items-start gap-1 text-slate-300">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          {booking.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Submitted</p>
                        <p className="mt-0.5 text-slate-300">
                          {new Date(booking.created_at).toLocaleString("en-US", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      {booking.remarks && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium text-slate-500">Remarks</p>
                          <p className="mt-0.5 text-slate-300">{booking.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
