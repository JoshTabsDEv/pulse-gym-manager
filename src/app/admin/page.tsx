import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import MemberForm from "@/components/member-form";
import MemberTable from "@/components/member-table";
import { authOptions } from "@/lib/auth";
import { getMembers } from "@/lib/members";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const members = await getMembers();

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase text-emerald-300">Admin console</p>
        <h1 className="text-3xl font-semibold text-white">
          Manage memberships
        </h1>
        <p className="text-slate-300">
          Create, update, or remove members. All changes persist to MySQL and
          power the read-only dashboard.
        </p>
      </div>

      <MemberForm />
      <MemberTable members={members} editable />
    </section>
  );
}

