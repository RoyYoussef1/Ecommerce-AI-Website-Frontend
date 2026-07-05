import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// POST /api/conversations/[id]/messages — append a message to an owned conversation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const { role, content, products } = body ?? {};

    if (role !== "user" && role !== "assistant") {
      return Response.json(
        { error: 'role must be "user" or "assistant"' },
        { status: 400 }
      );
    }
    if (typeof content !== "string") {
      return Response.json(
        { error: "content must be a string" },
        { status: 400 }
      );
    }

    // Ownership of the conversation is verified inside Strapi's message
    // controller (404 if the conversation doesn't exist or isn't the user's)
    const res = await fetch(`${STRAPI_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          role,
          content,
          products: Array.isArray(products) && products.length > 0 ? products : null,
          conversation: id,
        },
      }),
    });

    if (res.status === 404) {
      return Response.json({ error: "Conversation not found" }, { status: 404 });
    }
    if (!res.ok) {
      return Response.json(
        { error: "Failed to save message" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json({ id: data.data.documentId }, { status: 201 });
  } catch (err) {
    console.error("Append message error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
