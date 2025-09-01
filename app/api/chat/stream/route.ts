import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("prompt") || "";
    const history = searchParams.get("history") || "[]";

    const backendRes = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        history: JSON.parse(history),
      }),
    });

    if (!backendRes.ok || !backendRes.body) {
      return new Response("Backend failed", { status: 500 });
    }

    return new Response(backendRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Stream proxy error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
