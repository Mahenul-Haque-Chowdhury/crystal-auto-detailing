"use client";

import AdminShell from "@/components/AdminShell";
import { useEffect, useState, useCallback } from "react";
import { Search, Download, RefreshCw, Percent } from "lucide-react";

interface DiscountLead {
  id: string;
  name: string;
  phone: string;
  car_model: string;
  discount: number;
  created_at: string;
}

export default function AdminDiscountsPage() {
  const [leads, setLeads] = useState<DiscountLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/discounts?${params}`);
      const data = (await res.json()) as { leads?: DiscountLead[] };
      setLeads(data.leads ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const exportCSV = () => {
    if (leads.length === 0) return;
    const header = "Name,Phone,Car Model,Discount %,Date";
    const rows = leads.map(
      (l) =>
        `"${l.name}","${l.phone}","${l.car_model}",${l.discount},"${new Date(l.created_at).toLocaleDateString()}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `discount-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgDiscount = leads.length
    ? Math.round(leads.reduce((sum, l) => sum + l.discount, 0) / leads.length)
    : 0;

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Discount Leads</h1>
          <p className="mt-1 text-sm text-slate-400">
            View captured discount lead contacts
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xl font-bold text-white">{leads.length}</p>
            <p className="text-xs text-slate-500">Total Leads</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xl font-bold text-green-400">{avgDiscount}%</p>
            <p className="text-xs text-slate-500">Avg Discount</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xl font-bold text-gold-400">
              {leads.filter((l) => {
                const d = new Date(l.created_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p className="text-xs text-slate-500">This Month</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, car…"
              className="rounded-lg border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-gold-400"
            />
          </div>

          <button
            onClick={fetchLeads}
            className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>

          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="ml-auto flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-gold-300 disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">No discount leads yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="hidden px-4 py-3 md:table-cell">Car Model</th>
                  <th className="px-4 py-3 text-center">Discount</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-white/3">
                    <td className="px-4 py-3 font-medium text-white">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      <a
                        href={`tel:${lead.phone}`}
                        className="transition hover:text-gold-400"
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-slate-400 md:table-cell">
                      {lead.car_model}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-400/10 px-2.5 py-0.5 text-sm font-semibold text-green-400">
                        <Percent size={12} />
                        {lead.discount}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-slate-400 lg:table-cell">
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
