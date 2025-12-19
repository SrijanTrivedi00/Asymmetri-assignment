"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ChatForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/assistant", {
        query,
      });

      const data = res.data;

      setQuery("");
      router.refresh();
    } catch (err: any) {
      console.error("Assistant error:", err);

      if (axios.isAxiosError(err)) {
        alert(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to process query"
        );
      } else {
        alert("Network error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about weather, F1, stock prices..."
        className="flex-1 px-4 py-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-gray-900 text-white rounded cursor-pointer"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
