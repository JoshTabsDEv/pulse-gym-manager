import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import LoginForm from "@/components/login-form";
import { authOptions, googleAuthEnabled } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(session.user?.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <p className="text-sm uppercase text-emerald-300">Secure Access</p>
        <h1 className="text-3xl font-semibold text-white">Login</h1>
        <p className="text-slate-300">
          Admins can manage members with the built-in credentials account.
          Everyone else joins via Google and lands in the read-only dashboard.
        </p>
      </div>
      <LoginForm googleEnabled={googleAuthEnabled} />
    </section>
  );
}

