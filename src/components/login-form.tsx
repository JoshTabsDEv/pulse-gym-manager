"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  googleEnabled: boolean;
}

export default function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setSubmitting(false);

    if (result?.error) {
      setError("Invalid admin credentials.");
      return;
    }

    router.replace("/admin");
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-8 shadow-xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Admin Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Admin Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        {error && (
          <p className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Login as Admin"}
        </button>
      </form>

      <div className="mt-6 space-y-3 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-white/10" />
          <span>or</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={!googleEnabled}
          className="w-full rounded-md border border-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue with Google
        </button>
        {!googleEnabled && (
          <p className="text-xs text-amber-300">
            Add Google OAuth keys in env variables to enable this button.
          </p>
        )}
      </div>
    </div>
  );
}

