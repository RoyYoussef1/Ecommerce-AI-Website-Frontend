import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// GET /api/conversations/[id] — full message history for one owned conversation
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.strapiToken) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // id sorting is strictly insertion-ordered (createdAt can tie within a ms)
    const query =
      "populate[messages][sort][0]=id:asc" +
      "&populate[messages][fields][0]=role" +
      "&populate[messages][fields][1]=content" +
      "&populate[messages][fields][2]=products";

    const res = await fetch(
      `${STRAPI_URL}/api/conversations/${encodeURIComponent(id)}?${query}`,
      {
        headers: { Authorization: `Bearer ${session.strapiToken}` },
        cache: "no-store",
      }
    );

    if (res.status === 404) {
      // Strapi's controller returns 404 for both missing and non-owned records
      return Response.json({ error: "Conversation not found" }, { status: 404 });
    }
    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch conversation" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const c = data.data;

    return Response.json({
      id: c.documentId,
      title: c.title,
      messages: (c.messages ?? []).map((m: any) => ({
        role: m.role,
        content: m.content,
        products: m.products ?? [],
      })),
    });
  } catch (err) {
    console.error("Fetch conversation error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
