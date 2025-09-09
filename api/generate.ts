// api/generate.ts
import OpenAI from "openai";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { text?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const text = (body.text ?? "").toString().trim();
  if (!text) {
    return new Response(JSON.stringify({ error: 'Missing "text"' }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY missing" }), {
      status: 500,
      headers: { "content-type": "application/json" },
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
LANGUAGE must match the user's input. No markdown/backticks/explanations.`,
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
    const msg = e?.message || "Internal Server Error";
    return new Response(JSON.stringify({ error: `OpenAI error: ${msg}` }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
