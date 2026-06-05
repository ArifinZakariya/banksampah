import { cookies } from "next/headers";
import { verifyToken, type TokenPayload } from "./jwt";

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(role?: string): Promise<TokenPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (role && session.role !== role) {
    throw new Error("Forbidden");
  }
  return session;
}
