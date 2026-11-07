import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { getStore } from "./db";

const COOKIE = "hemizat_admin";

function secret() {
  return process.env.ADMIN_SECRET || "hemizat-elbal-secret-change-me";
}

export function signAdminToken(password: string) {
  return createHmac("sha256", secret()).update(password).digest("hex");
}

export async function isAdmin() {
  const store = await getStore();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  return token === signAdminToken(store.settings.adminPassword);
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    const error = new Error("Unauthorized");
    (error as Error & { status: number }).status = 401;
    throw error;
  }
}

export { COOKIE as ADMIN_COOKIE };
