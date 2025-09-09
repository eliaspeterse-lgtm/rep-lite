// api/generate.ts
import OpenAI from "openai";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Läs POST-body
  let body: { text?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const text = (body.text ?? "").toString().trim();
  if (!text) return new Response('Missing "text"', { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Server misconfigured: OPENAI_API_KEY missing", { status: 500 });
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
LANGUAGE: same as input. No markdown/backticks/explanations.`,
        },
        { role: "user", content: text },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }

    const result = {
      tweets: Array.isArray(parsed.tweets) ? parsed.tweets.slice(0, 3).map((t: any) => String(t)) : [],
      linkedin: String(parsed.linkedin ?? ""),
      instagram: String(parsed.instagram ?? ""),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(e?.message ? `OpenAI error: ${e.message}` : "Internal Server Error", { status: 500 });
  }
}
