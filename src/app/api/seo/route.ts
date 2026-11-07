import { generateSeo } from "@/lib/seo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    seo: generateSeo({
      name: body.name || "",
      brand: body.brand || "",
      model: body.model || "",
      size: body.size || "",
      condition: body.condition || "",
      category: body.category === "bags" ? "bags" : "sneakers",
      description: body.description || "",
    }),
    slug: body.name || body.model || "",
  });
}
