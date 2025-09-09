import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server misconfigured: OPENAI_API_KEY missing" });

  const { text } = req.body ?? {};
  const input = String(text ?? "").trim();
  if (!input) return res.status(400).json({ error: 'Missing "text"' });

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Return ONLY JSON with keys { "tweets": string[3], "linkedin": string, "instagram": string }. Language must match the input. No markdown/backticks.',
        },
        { role: "user", content: input },
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

    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal Server Error" });
  }
}
