import axios from "axios";

export async function getWeather(city: string) {
  try {
    const q = encodeURIComponent(city);
    const url = `https://wttr.in/${q}?format=j1`;

    const res = await axios.get(url);
    const data = res.data;
    const current = data.current_condition?.[0];
    if (!current) {
      return `Weather data for ${city} is unavailable.`;
    }

    const description = current.weatherDesc?.[0]?.value ?? "unknown";
    const temp = current.temp_C ?? "N/A";

    return `Weather in ${city}: ${description}, ${temp}°C`;
  } catch (err: any) {
    return `Error fetching weather for ${city}: ${err?.message ?? err}`;
  }
}

//USING PERPLEXITY API FOR F1 AND STOCK PRICE REALTIME DATA

export async function getF1Matches() {
  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content:
              "Next upcoming F1 race after current date with date, location, circuit",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const contentPP = response.data.choices[0].message.content;
    const content = contentPP
      // Remove ANY citation-like square bracket content
      // [1], [12], [1][3][5], [web:1], [image:3], etc.
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

    return content || "No upcoming F1 race found.";
  } catch (err: any) {
    return `Error: Could not fetch F1 race info: ${err.message}`;
  }
}

export async function getStockPrice(symbol: string) {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) return `Perplexity API key not configured (PERPLEXITY_API_KEY).`;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: `Current stock price for ${symbol.toUpperCase()} with latest quote and change.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const contentPP = response.data.choices[0].message.content;
    const content = contentPP
      // Remove ANY citation-like square bracket content
      // [1], [12], [1][3][5], [web:1], [image:3], etc.
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (!content || content.includes("no data")) {
      return `No data for symbol ${symbol.toUpperCase()}.`;
    }

    return content;
  } catch (err: any) {
    return `Error: Could not fetch stock price for ${symbol}: ${
      err?.message ?? err
    }`;
  }
}
