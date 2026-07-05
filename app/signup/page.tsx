"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiSparkles,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
} from "react-icons/hi2";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Register directly against Strapi — it stays the source of truth
      const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Strapi v4/v5 error shape: { error: { message, details } }
        setError(
          data?.error?.message ||
            "Registration failed. Please check your details and try again."
        );
        setLoading(false);
        return;
      }

      // Account created — log in through NextAuth to establish the session
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        // Account exists but auto-login failed (e.g. email confirmation required)
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Could not reach the server. Please try again later.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="glass-card p-8 animate-fade-up">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40">
            <HiSparkles className="text-white" size={22} />
          </span>
          <h1 className="font-display text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Join NOVA and shop at the speed of thought
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <div className="relative">
              <HiOutlineUser
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                id="username"
                type="text"
                required
                minLength={3}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="glass w-full rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <div className="relative">
              <HiOutlineEnvelope
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass w-full rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="glass w-full rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="glass w-full rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full py-3 text-sm disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-300 transition hover:text-cyan-300"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
