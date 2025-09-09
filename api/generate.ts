// api/generate.ts
import OpenAI from "openai";

// Kör som Edge Function på Vercel (snabb och enkel Request/Response API)
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Läs in body
  let body: { text?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const text = (body.text ?? "").toString().trim();
  if (!text) {
    return new Response('Missing "text"', { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Viktigt: lägg OPENAI_API_KEY i Vercel → Project → Settings → Environment Variables
    return new Response("Server misconfigured: OPENAI_API_KEY missing", {
      status: 500,
    });
  }

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Return ONLY a valid JSON object with EXACTLY:
{
  "tweets": string[3],
  "linkedin": string,
  "instagram": string
}
LANGUAGE: Same as user input. No markdown, no explanations, no backticks.`,
        },
        { role: "user", content: text },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    // Parsea och normalisera så frontenden alltid får rätt struktur
    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const result = {
      tweets: Array.isArray(parsed.tweets)
        ? parsed.tweets.slice(0, 3).map((t: any) => String(t))
        : [],
      linkedin: String(parsed.linkedin ?? ""),
      instagram: String(parsed.instagram ?? ""),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(
      e?.message ? `OpenAI error: ${e.message}` : "Internal Server Error",
      { status: 500 }
    );
  }
}
