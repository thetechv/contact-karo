"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v0/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || "Login failed");
      }

      // on success the API sets a cookie; navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Employee Login</h1>
        <p className="mb-6 text-sm text-slate-600">Sign in with your email and password to continue.</p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              required
            />
          </label>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
