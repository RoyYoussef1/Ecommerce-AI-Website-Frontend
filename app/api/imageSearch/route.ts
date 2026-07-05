import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const backendRes = await fetch("http://localhost:3001/imageSearch", {
      method: "POST",
      body: formData,
    });

    if (!backendRes.ok || !backendRes.body) {
      let message = "Backend failed";
      try {
        const err = await backendRes.json();
        if (err?.error) message = err.error;
      } catch {}
      return Response.json({ error: message }, { status: backendRes.status || 500 });
    }

    return new Response(backendRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Image search proxy error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
