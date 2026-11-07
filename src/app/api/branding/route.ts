import { getStore } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({
    storeName: store.settings.storeName,
    tagline: store.settings.tagline,
    logoUrl: store.settings.logoUrl || "/branding/logo.jpg",
  });
}
