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

    // More robust intent detection: allow variants like "formula1", "formula-1", "grand-prix"
    if (/\b(?:weather|temperature|forecast|climate|rain|snow|sunny|cloudy)\b/.test(qLower)) {
      const m = query.match(/in\s+([a-zA-Z \-,']+)/i);
      const location = m ? m[1].trim() : "London";
      assistantText = await getWeather(location);
    } else if (/\b(?:f1|formula\s*-?\s*1|formula1|grand\s*-?\s*prix|grandprix|race|races)\b/.test(qLower)) {
      assistantText = await getF1Matches();
    } else if (/\b(?:stock|price|quote|ticker)\b/.test(qLower)) {
      // Prefer explicit symbol following keywords like "stock AAPL" else fallback to first 1-5 letter token
      const mExplicit = query.match(/(?:stock|quote|ticker|price)\s+([A-Za-z]{1,5})\b/i);
      const mFallback = query.match(/\b([A-Za-z]{1,5})\b/);
      const symbol = (mExplicit?.[1] || mFallback?.[1] || "AAPL").toUpperCase();
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
