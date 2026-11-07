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
  return NextResponse.json({
    settings: {
      ...store.settings,
      smtp: { ...store.settings.smtp, pass: store.settings.smtp.pass ? "••••••" : "" },
      adminPassword: "",
    },
  });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const settings = await updateStore((store) => {
    store.settings.storeName = body.storeName ?? store.settings.storeName;
    store.settings.tagline = body.tagline ?? store.settings.tagline;
    store.settings.logoUrl = body.logoUrl ?? store.settings.logoUrl;
    store.settings.ownerEmail = body.ownerEmail ?? store.settings.ownerEmail;
    store.settings.ownerPhone = body.ownerPhone ?? store.settings.ownerPhone;
    store.settings.whatsapp = body.whatsapp ?? store.settings.whatsapp;
    store.settings.webhookUrl = body.webhookUrl ?? store.settings.webhookUrl;
    store.settings.callmebotKey = body.callmebotKey ?? store.settings.callmebotKey;
    if (body.adminPassword) store.settings.adminPassword = String(body.adminPassword);
    store.settings.smtp = {
      host: body.smtp?.host ?? store.settings.smtp.host,
      port: Number(body.smtp?.port ?? store.settings.smtp.port),
      user: body.smtp?.user ?? store.settings.smtp.user,
      pass: body.smtp?.pass && body.smtp.pass !== "••••••" ? body.smtp.pass : store.settings.smtp.pass,
      from: body.smtp?.from ?? store.settings.smtp.from,
    };
    return store.settings;
  });
  return NextResponse.json({ ok: true, settings: { ...settings, adminPassword: "", smtp: { ...settings.smtp, pass: settings.smtp.pass ? "••••••" : "" } } });
}
