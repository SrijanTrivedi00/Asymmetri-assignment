import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabaseServer";
import { getWeather, getF1Matches, getStockPrice } from "../../../lib/tools";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query: string = (body.query || "").toString().trim();
    if (!query) return NextResponse.json({ error: "empty query" }, { status: 400 });

    const session = await getServerSession(authOptions as any);
    const userId = session?.user?.email ?? "anonymous";

    const supabase = getSupabaseServer();

    const insertUser = await supabase.from("messages").insert([{ user_id: userId, role: "user", content: query }]);
    if (insertUser.error) {
      // If table missing or permission issue, return a clear message and do not crash the server
      const msg = insertUser.error.message || "Failed to insert user message";
      console.error("Supabase insert user error:", insertUser.error);
      return NextResponse.json({ error: "Database error: " + msg, hint: "Make sure the `messages` table exists and your SUPABASE_SERVICE_ROLE_KEY is set." }, { status: 500 });
    }

    let assistantText = "I'm here to help. Ask me about weather, F1 races, or stock prices.";
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
      assistantText = `You asked: "${query}" — I can call tools for weather, F1, or stock prices. Try "weather in Paris", "next f1 race", or "stock AAPL".`;
    }

    const insertAssistant = await supabase.from("messages").insert([{ user_id: userId, role: "assistant", content: assistantText }]);
    if (insertAssistant.error) {
      console.error("Supabase insert assistant error:", insertAssistant.error);

      return NextResponse.json({ assistant: assistantText, warning: "Failed to persist assistant message: " + insertAssistant.error.message }, { status: 200 });
    }

    return NextResponse.json({ assistant: assistantText });
  } catch (err: any) {
    console.error("/api/assistant error:", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
