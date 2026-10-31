import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Checked on the server, so signed-out visitors never receive the dashboard
  const token = (await cookies()).get("auth-token")?.value;
  if (!token || !verifyToken(token)) {
    redirect("/admin/login");
  }

  return children;
}
