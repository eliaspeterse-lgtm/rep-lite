// api/generate.ts
import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body || {};
  if (!text || typeof text !== "string") return res.status(400).json({ error: "No text provided" });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a social media repurposing assistant.
Return ONLY JSON with:
- tweets: string[3]
- linkedin: string
- instagram: string
Language must match the input. No clichés/filler.`,
        },
        { role: "user", content: String(text) },
      ],
    });

    res.status(200).send(completion.choices[0].message?.content || "{}");
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Failed" });
  }
}
