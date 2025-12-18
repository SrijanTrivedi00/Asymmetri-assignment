import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getSupabaseServer } from "../../lib/supabaseServer";
import ChatForm from "./ChatForm";
import React from "react";
import { getWeather, getF1Matches, getStockPrice } from "../../lib/tools";

export const metadata = {
  title: "Home",
};

// Server Action to handle user queries and persist chat to Supabase
export async function handleUserQuery(formData: FormData) {
  "use server";
  const query = formData.get("query")?.toString()?.trim();
  if (!query) return;

  // session lookup
  const session = await getServerSession(authOptions as any);
  const userId = session?.user?.email ?? "anonymous";

  // instantiate supabase server client
  const supabase = getSupabaseServer();

  // store user message
  await supabase
    .from("messages")
    .insert([{ user_id: userId, role: "user", content: query }]);

  // decide which tool to call
  let assistantText =
    "I'm here to help. Ask me about weather, F1 races, or stock prices.";

  const qLower = query.toLowerCase();
  if (/\b(weather|temperature|forecast)\b/.test(qLower)) {
    const m = query.match(/in ([a-zA-Z ,]+)/i);
    const location = m ? m[1].trim() : "London";
    assistantText = await getWeather(location);
  } else if (/\b(f1|formula 1|race|grand prix)\b/.test(qLower)) {
    assistantText = await getF1Matches();
  } else if (/\b(stock|price|quote)\b/.test(qLower)) {
    const m = query.match(/([A-Za-z]{1,5})\b/);
    const symbol = m ? m[1].toUpperCase() : "AAPL";
    assistantText = await getStockPrice(symbol);
  } else {
    // fallback: no tool, echo back
    assistantText = `You asked: "${query}" — I can call tools for weather, F1, or stock prices. Try "weather in Paris", "next f1 race", or "stock AAPL".`;
  }

  // store assistant message
  await supabase
    .from("messages")
    .insert([{ user_id: userId, role: "assistant", content: assistantText }]);

  // returning nothing; the page will re-render on form submission
}

async function fetchMessages(userId?: string) {
  if (!userId) return [];
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("messages")
      .select("id, user_id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) {
      console.warn("Error fetching messages:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("Supabase unavailable:", err);
    return [];
  }
}

export default async function HomePage() {
  const session: Session | null = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/login");
  }

  const userId = session?.user?.email ?? session?.user?.name ?? null;
  const messages = await fetchMessages(userId ?? undefined);

  return (
    <main className="min-h-screen flex items-start justify-center bg-gradient-to-b from-white to-gray-50 py-12">
      <section className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Asymmetri Assistant</h1>
            <p className="text-sm text-gray-500">
              Hello,{" "}
              <span className="font-medium">
                {session?.user?.name ?? session?.user?.email}
              </span>
            </p>
          </div>
        </header>

        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto p-2 border rounded">
          {messages.map((m: any) => (
            <div
              key={m.id}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              <div
                className={
                  "inline-block p-3 rounded-lg " +
                  (m.role === "user" ? "bg-gray-100" : "bg-blue-50")
                }
              >
                {m.content}
              </div>
              <div className="text-xs text-gray-400 mt-1">{m.role}</div>
            </div>
          ))}
        </div>

        <React.Suspense fallback={<div>Loading form...</div>}>
          <ChatForm />
        </React.Suspense>
      </section>
    </main>
  );
}
