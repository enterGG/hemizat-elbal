import { ADMIN_COOKIE, signAdminToken } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || "");
  const store = await getStore();
  if (password !== store.settings.adminPassword) {
    return NextResponse.json({ error: "الرمز غير صحيح" }, { status: 401 });
  }
  (await cookies()).set(ADMIN_COOKIE, signAdminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return NextResponse.json({ ok: true });
}
