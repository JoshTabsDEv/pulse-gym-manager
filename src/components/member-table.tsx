"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Member, MemberStatus } from "@/types/member";

const toInputDate = (value: string | null) =>
  value ? value.split("T")[0] : "";

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

interface MemberTableProps {
  members: Member[];
  editable?: boolean;
}

const statusOptions: MemberStatus[] = ["ACTIVE", "PAUSED", "CANCELLED"];

export default function MemberTable({
  members,
  editable = false,
}: MemberTableProps) {
  if (!members.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-400">
        No members yet. Add the first one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 shadow">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">Membership</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Dates</th>
            {editable && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-900/60 text-sm text-white">
          {members.map((member) => (
            <EditableRow key={member.id} member={member} editable={editable} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditableRow({
  member,
  editable,
}: {
  member: Member;
  editable: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: member.fullName,
    membershipType: member.membershipType,
    status: member.status,
    startDate: toInputDate(member.startDate),
    endDate: toInputDate(member.endDate),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setError(null);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/members/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to update member.");
      return;
    }

    setIsEditing(false);
    router.refresh();
  };

  const deleteMember = async () => {
    const confirmed = window.confirm(
      `Delete ${member.fullName}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setLoading(true);
    const response = await fetch(`/api/members/${member.id}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to delete member.");
      return;
    }

    router.refresh();
  };

  return (
    <tr className="align-top">
        <td className="px-4 py-4">
          {isEditing ? (
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded border border-white/10 bg-slate-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <div>
              <p className="font-medium">{member.fullName}</p>
              <p className="text-xs text-slate-400">
                Created {new Date(member.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </td>
        <td className="px-4 py-4">
          {isEditing ? (
            <input
              name="membershipType"
              value={form.membershipType}
              onChange={handleChange}
              className="w-full rounded border border-white/10 bg-slate-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            member.membershipType
          )}
        </td>
        <td className="px-4 py-4">
          {isEditing ? (
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded border border-white/10 bg-slate-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                member.status === "ACTIVE"
                  ? "bg-emerald-500/20 text-emerald-200"
                  : member.status === "PAUSED"
                    ? "bg-amber-500/20 text-amber-200"
                    : "bg-rose-500/20 text-rose-200"
              }`}
            >
              {member.status}
            </span>
          )}
        </td>
        <td className="px-4 py-4 text-sm text-slate-300">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full rounded border border-white/10 bg-slate-800 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full rounded border border-white/10 bg-slate-800 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <>
              <p>Start: {formatDate(member.startDate)}</p>
              <p>End: {formatDate(member.endDate)}</p>
            </>
          )}
        </td>
        {editable && (
          <td className="px-4 py-4 text-right text-sm">
            {isEditing ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={loading}
                  className="w-full rounded bg-emerald-500 px-3 py-1 font-medium text-white hover:bg-emerald-400 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="w-full rounded bg-slate-700 px-3 py-1 font-medium text-white hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="w-full rounded bg-slate-700 px-3 py-1 font-medium text-white hover:bg-slate-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={deleteMember}
                  className="w-full rounded bg-rose-600 px-3 py-1 font-medium text-white hover:bg-rose-500"
                >
                  Delete
                </button>
              </div>
            )}
            {error && (
              <p className="mt-2 text-xs text-rose-300">
                {error}
              </p>
            )}
          </td>
        )}
    </tr>
  );
}

