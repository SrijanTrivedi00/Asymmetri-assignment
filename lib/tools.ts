import axios from "axios";

export async function getWeather(location: string) {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return `OpenWeatherMap API key not configured (OPENWEATHER_API_KEY).`;

  try {
    const q = encodeURIComponent(location);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${key}`;
    const res = await axios.get(url);
    const data = res.data;
    const description = data.weather?.[0]?.description ?? "unknown";
    const temp = data.main?.temp;
    return `Weather in ${data.name}: ${description}, ${temp}°C`;
  } catch (err: any) {
    return `Could not fetch weather for ${location}: ${err?.message ?? err}`;
  }
}

export async function getF1Matches() {
  try {
    const url = `https://ergast.com/api/f1/current/next.json`;
    const res = await axios.get(url);
    const race = res.data?.MRData?.RaceTable?.Races?.[0];
    if (!race) return `No upcoming F1 race found.`;
    const name = race.raceName;
    const circuit = race.Circuit?.circuitName;
    const date = race.date;
    const time = race.time ?? "";
    return `Next F1 race: ${name} at ${circuit} on ${date} ${time}`;
  } catch (err: any) {
    return `Could not fetch F1 race info: ${err?.message ?? err}`;
  }
}

export async function getStockPrice(symbol: string) {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return `Alpha Vantage API key not configured (ALPHA_VANTAGE_API_KEY).`;

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
    const res = await axios.get(url);
    const data = res.data?.["Global Quote"];
    if (!data) return `No data for symbol ${symbol}.`;
    const price = data["05. price"];
    return `Price for ${symbol.toUpperCase()}: $${price}`;
  } catch (err: any) {
    return `Could not fetch stock price for ${symbol}: ${err?.message ?? err}`;
  }
}
