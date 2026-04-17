"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-zinc-200">
          Redirecting to Admin Dashboard...
        </h1>
        <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
