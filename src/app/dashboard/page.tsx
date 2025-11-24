import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import MemberTable from "@/components/member-table";
import { authOptions } from "@/lib/auth";
import { getMembers } from "@/lib/members";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const members = await getMembers();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase text-emerald-300">Member view</p>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-slate-300">
          Signed in as {session.user?.name ?? "user"} (
          {session.user?.role ?? "user"}). This page is read-only for members and
          trainers so they can review enrollment status without changing data.
        </p>
      </div>

      <MemberTable members={members} />
    </section>
  );
}

