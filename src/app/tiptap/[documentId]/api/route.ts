// app/api/files/[documentId]/route.ts
import { NextResponse } from "next/server";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  const filePath = path.join(
    process.cwd(),
    "public",
    "contents",
    `${title}`,
    "index.html"
  );

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return new NextResponse(fileContent, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(`Error reading file ${title}:`, error);
    return new NextResponse("File not found", { status: 404 });
  }
}
