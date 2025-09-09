// /api/generate.ts
import OpenAI from "openai";

// Kör som Edge Function (snabbare cold starts)
export const config = { runtime: "edge" };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export default async function handler(req: Request) {
  // Tillåt ev. preflight om det behövs framöver
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

  // Läs POST-body
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const text = (body?.text ?? "").toString().trim();
  if (!text) return json({ error: 'Missing "text"' }, 400);

  // Env måste vara satt i Vercel (Project → Settings → Environment Variables)
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: "Server misconfigured: OPENAI_API_KEY missing" }, 500);

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a social media repurposing assistant.
Return ONLY a valid JSON object with EXACTLY:
{
  "tweets": string[3],
  "linkedin": string,
  "instagram": string
}
Rules:
- LANGUAGE must match the input.
- No markdown, backticks or explanations. JSON object only.`,
        },
        { role: "user", content: text },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
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
      linkedin: typeof parsed.linkedin === "string" ? parsed.linkedin : "",
      instagram: typeof parsed.instagram === "string" ? parsed.instagram : "",
    };

    return json(result, 200);
  } catch (e: any) {
    return json(
      { error: e?.message ? `OpenAI error: ${e.message}` : "Internal Server Error" },
      500
    );
  }
}
