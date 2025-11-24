"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { MemberStatus } from "@/types/member";

const statusOptions: MemberStatus[] = ["ACTIVE", "PAUSED", "CANCELLED"];

const defaultForm = {
  fullName: "",
  membershipType: "",
  status: "ACTIVE" as MemberStatus,
  startDate: "",
  endDate: "",
};

export default function MemberForm() {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...defaultForm }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to create member.");
      return;
    }

    setSuccess("Member added successfully.");
    setForm({ ...defaultForm });
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow"
    >
      <h2 className="text-lg font-semibold text-white">Add New Member</h2>
      <p className="text-sm text-slate-400">
        Create a record for every client you’re managing.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="text-sm text-slate-300" htmlFor="membershipType">
            Membership
          </label>
          <input
            id="membershipType"
            name="membershipType"
            value={form.membershipType}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. Premium, Class Pack"
            required
          />
        </div>

        <div>
          <label className="text-sm text-slate-300" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300" htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="text-sm text-slate-300" htmlFor="endDate">
            End date (optional)
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded bg-red-500/20 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100">
          {success}
        </p>
      )}

      <div className="mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save member"}
        </button>
      </div>
    </form>
  );
}

