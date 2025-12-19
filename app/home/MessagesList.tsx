"use client";

import React, { useEffect, useRef } from "react";

type Msg = {
  id: number | string;
  role: string;
  content: string;
  created_at?: string | null;
};

export default function MessagesList({ messages }: { messages: Msg[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch (e) {
        el.scrollTop = el.scrollHeight;
      }
    }
    if (lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto p-4 border rounded-lg bg-linear-to-b from-gray-50 to-white shadow-inner"
    >
      {messages.map((m, idx) => {
        const isUser = m.role === "user";
        const bubbleBase =
          "max-w-[80%] inline-block p-4 rounded-2xl shadow-sm text-sm leading-6";
        const bubble = isUser
          ? `${bubbleBase} bg-gradient-to-r from-indigo-100 to-purple-50 text-gray-900 rounded-br-md`
          : `${bubbleBase} bg-white/95 border border-gray-100 text-gray-800 rounded-bl-md`;

        return (
          <div
            key={m.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-3`}
          >
            {!isUser && (
              <div className="shrink-0 h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
                AI
              </div>
            )}

            <div className={bubble}>
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className="text-xs text-gray-400 mt-2 text-right">
                {m.created_at ? new Date(m.created_at).toLocaleString() : m.role}
              </div>
            </div>

            {isUser && (
              <div className="shrink-0 h-9 w-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-medium text-sm">
                You
              </div>
            )}

            {idx === messages.length - 1 && <div ref={lastRef} />}
          </div>
        );
      })}
    </div>
  );
}
