"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function SiteHeader() {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Pulse Gym
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-1 transition ${
                pathname === item.href
                  ? "bg-slate-800 text-white"
                  : "hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`rounded px-3 py-1 transition ${
                pathname.startsWith("/admin")
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-300 hover:text-white"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-slate-300">
                {session.user?.name} ({session.user?.role})
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-900 transition hover:bg-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded bg-emerald-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

