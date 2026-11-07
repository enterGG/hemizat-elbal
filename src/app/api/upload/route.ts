import { requireAdmin } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files");
  const urls: string[] = [];

  await fs.mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });

  for (const file of files) {
    if (!(file instanceof File)) continue;
    const ext = path.extname(file.name) || (file.type.startsWith("video/") ? ".mp4" : ".jpg");
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(process.cwd(), "public", "uploads", name), buf);
    urls.push(`/uploads/${name}`);
  }

  return NextResponse.json({ urls });
}
