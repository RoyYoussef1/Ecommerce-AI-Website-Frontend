"use client";

import { useEffect, useState } from "react";
import {
  HiPlus,
  HiOutlineChatBubbleLeftRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ChatSidebar({
  activeId,
  refreshKey,
  onSelect,
  onNewChat,
}: {
  activeId: string | null;
  refreshKey: number;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/conversations", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setConversations(data.conversations ?? []);
      } catch {
        // sidebar is non-critical; fail silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (collapsed) {
    return (
      <div className="hidden md:flex flex-col items-center gap-2 pt-2">
        <button
          onClick={() => setCollapsed(false)}
          className="glass flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:border-indigo-400/40 transition"
          aria-label="Expand chat history"
          title="Chat history"
        >
          <HiChevronRight size={18} />
        </button>
        <button
          onClick={onNewChat}
          className="glass flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:border-indigo-400/40 transition"
          aria-label="New chat"
          title="New chat"
        >
          <HiPlus size={18} />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col glass-strong rounded-3xl p-3 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onNewChat}
          className="btn-neon flex-1 py-2.5 text-sm"
        >
          <HiPlus size={16} />
          New Chat
        </button>
        <button
          onClick={() => setCollapsed(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          aria-label="Collapse sidebar"
        >
          <HiChevronLeft size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {loading ? (
          <p className="px-3 py-2 text-sm text-slate-500">Loading…</p>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <HiOutlineChatBubbleLeftRight
              className="mx-auto mb-2 text-slate-600"
              size={24}
            />
            <p className="text-sm text-slate-500">
              No conversations yet. Start chatting!
            </p>
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                c.id === activeId
                  ? "bg-indigo-500/20 text-indigo-200"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="block truncate text-sm font-medium">
                {c.title || "Untitled chat"}
              </span>
              <span className="block text-xs text-slate-500 mt-0.5">
                {timeAgo(c.updatedAt)}
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
