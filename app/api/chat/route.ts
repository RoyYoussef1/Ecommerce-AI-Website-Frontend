import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendRes.ok) {
    return NextResponse.json({ error: "Failed to fetch backend" }, { status: 500 });
  }

  const data = await backendRes.json();
  return NextResponse.json(data);
}
