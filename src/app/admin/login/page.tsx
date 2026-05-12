"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/auth/PasswordField";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/login-prefill")
      .then((res) => (res.ok ? res.json() : { email: "" }))
      .then((data: { email?: string }) => {
        if (!cancelled && data.email) setEmail(data.email);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f0ff] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-[#d8ceff] bg-white p-10 shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-[#241a46]">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with the credentials configured in{" "}
            <code className="rounded bg-gray-100 px-1 text-xs">ADMIN_EMAIL</code> and{" "}
            <code className="rounded bg-gray-100 px-1 text-xs">ADMIN_PASSWORD</code> on the server.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <PasswordField
              label="Password"
              labelClassName="sr-only"
              fieldWrapperClassName="relative"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              required
              autoComplete="current-password"
              inputClassName="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#6869F9] focus:outline-none focus:ring-[#6869F9] sm:text-sm"
              toggleButtonClassName="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#6869F9] px-4 py-3 text-sm font-medium text-white hover:bg-[#5657e8] focus:outline-none focus:ring-2 focus:ring-[#6869F9] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
