import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// GET /api/conversations — list the logged-in user's conversations, newest first
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/conversations?sort=updatedAt:desc&fields[0]=title&fields[1]=updatedAt`,
      {
        headers: { Authorization: `Bearer ${session.strapiToken}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch conversations" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const conversations = (data.data ?? []).map((c: any) => ({
      id: c.documentId,
      title: c.title,
      updatedAt: c.updatedAt,
    }));

    return Response.json({ conversations });
  } catch (err) {
    console.error("List conversations error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/conversations — create a conversation, title from the first message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const firstMessage =
      typeof body?.firstMessage === "string" ? body.firstMessage.trim() : "";

    const title =
      firstMessage.length > 50
        ? `${firstMessage.slice(0, 50).trimEnd()}…`
        : firstMessage || "New chat";

    const res = await fetch(`${STRAPI_URL}/api/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.strapiToken}`,
      },
      body: JSON.stringify({ data: { title } }),
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to create conversation" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(
      { id: data.data.documentId, title: data.data.title },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create conversation error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
