"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Contours from "@/components/common/Contours";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });
        if (response.ok) {
          router.replace("/admin/dashboard");
        }
      } catch {
        // Not logged in, stay on login page
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        router.replace("/admin/dashboard");
        return;
      }
      setError(data.error === "Invalid credentials" ? "That email and password don't match." : data.error || "Sign in failed. Try again.");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setIsLoading(false);
  };

  return (
    <main className="relative overflow-hidden bg-band min-h-screen flex items-center justify-center px-4 py-10">
      <Contours className="text-on-band opacity-[0.12]" />
      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-line bg-raised p-6 sm:p-8 shadow-[var(--shadow-pop)]">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-muted">Manage your portfolio.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <p role="alert" className="rounded-lg bg-danger-soft text-danger text-sm font-medium px-3 py-2.5">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="field"
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="field !pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="icon-btn absolute top-0.5 right-0.5 !h-9 !w-9"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? "Signing in" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm">
          <Link href="/" className="relative font-medium text-on-band underline underline-offset-4 decoration-band-line hover:decoration-saffron">
            Back to the portfolio
          </Link>
        </p>
      </div>
    </main>
  );
}
