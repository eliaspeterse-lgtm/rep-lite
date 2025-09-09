import OpenAI from "openai";
export const config = { runtime: "edge" };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

  let body: any = {};
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  const text = (body?.text ?? "").toString().trim();
  if (!text) return json({ error: 'Missing "text"' }, 400);

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
          content: `Return ONLY JSON with EXACTLY:
{
  "tweets": string[3],
  "linkedin": string,
  "instagram": string
}
LANGUAGE must match input. No markdown/backticks/explanations.`
        },
        { role: "user", content: text },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }

    return json({
      tweets: Array.isArray(parsed.tweets) ? parsed.tweets.slice(0, 3).map((t: any) => String(t)) : [],
      linkedin: typeof parsed.linkedin === "string" ? parsed.linkedin : "",
      instagram: typeof parsed.instagram === "string" ? parsed.instagram : "",
    });
  } catch (e: any) {
    return json({ error: e?.message ? `OpenAI error: ${e.message}` : "Internal Server Error" }, 500);
  }
}
