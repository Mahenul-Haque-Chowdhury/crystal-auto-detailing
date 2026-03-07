import { cookies } from "next/headers";
import { isValidToken } from "@/lib/adminTokens";

// Validate admin token server-side
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  return isValidToken(token);
}
