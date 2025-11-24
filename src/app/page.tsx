import Link from "next/link";

const highlights = [
  "Log new sign-ups, freezes, and cancellations without leaving the front desk.",
  "Give coaches a live roster showing who's active, paused, or overdue.",
  "Store membership timelines, payment tiers, and renewal dates in one view.",
  "Let staff welcome members with Google login while admins keep full control.",
];

export default function Home() {
  return (
    <section className="space-y-10 rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-2xl shadow-emerald-500/10">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
          Pulse Gym OS
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
          A minimal gym management system built for quick deployments.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Ship a secure admin console plus a read-only member dashboard with a
          single Next.js app. Credentials-based admin access, Google sign-in for
          members, and MySQL CRUD APIs are already wired up.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400"
          >
            Get started
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
          >
            View member dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {highlights.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
