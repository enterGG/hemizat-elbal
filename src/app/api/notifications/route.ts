import { requireAdmin } from "@/lib/auth";
import { getStore, updateStore } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await getStore();
  return NextResponse.json({ notifications: store.notifications });
}

export async function PUT() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await updateStore((store) => {
    store.notifications = store.notifications.map((item) => ({ ...item, read: true }));
  });
  return NextResponse.json({ ok: true });
}
