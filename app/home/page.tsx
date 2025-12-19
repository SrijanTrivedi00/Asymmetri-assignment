import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getSupabaseServer } from "../../lib/supabaseServer";
import ChatForm from "./ChatForm";
import MessagesList from "./MessagesList";
import React from "react";
import { getWeather, getF1Matches, getStockPrice } from "../../lib/tools";
import Header from "./Header";

export const metadata = {
  title: "Home",
};

export async function handleUserQuery(formData: FormData) {
  "use server";
  const query = formData.get("query")?.toString()?.trim();
  if (!query) return;
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.email ?? "anonymous";
  const supabase = getSupabaseServer();

  // store user message
  await supabase
    .from("messages")
    .insert([{ user_id: userId, role: "user", content: query }]);

  let assistantText =
    "I'm here to help. Ask me about weather, F1 races, or stock prices.";

  const qLower = query.toLowerCase();

  if (
    /\b(?:weather|temperature|forecast|climate|rain|snow|sunny|cloudy)\b/.test(
      qLower
    )
  ) {
    const m = query.match(/in\s+([a-zA-Z \-,']+)/i);
    const location = m ? m[1].trim() : "London";
    assistantText = await getWeather(location);
  } else if (
    /\b(?:f1|formula\s*-?\s*1|formula1|grand\s*-?\s*prix|grandprix|race|races)\b/.test(
      qLower
    )
  ) {
    assistantText = await getF1Matches();
  } else if (/\b(?:stock|price|quote|ticker)\b/.test(qLower)) {
    const mExplicit = query.match(
      /(?:stock|quote|ticker|price)\s+([A-Za-z]{1,5})\b/i
    );
    const mFallback = query.match(/\b([A-Za-z]{1,5})\b/);
    const symbol = (mExplicit?.[1] || mFallback?.[1] || "AAPL").toUpperCase();
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
    <main className="min-h-screen flex items-start justify-center bg-linear-to-b from-zinc-100 via-white to-zinc-50 py-12">
      <section className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 md:p-8 min-h-[75vh] flex flex-col">
        <Header name={session.user?.name} email={session.user?.email} />
        <MessagesList messages={messages} />
        <React.Suspense fallback={<div>Loading form...</div>}>
          <ChatForm />
        </React.Suspense>
      </section>
    </main>
  );
}
