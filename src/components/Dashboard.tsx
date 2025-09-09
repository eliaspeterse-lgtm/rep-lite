import { useState } from "react";

type GenerationResult = {
  tweets: string[];
  linkedin: string;
  instagram: string;
};

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onGenerate = async () => {
    setErr(null);
    setData(null);
    setLoading(true);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || `HTTP ${resp.status}`);
      }
      const json = (await resp.json()) as GenerationResult;
      setData(json);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Dashboard</h1>
      <p>Paste your content and generate platform-specific posts.</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: "100%", marginTop: 12 }}
        placeholder="Paste your content here…"
      />

      <div style={{ marginTop: 12 }}>
        <button disabled={loading || !input.trim()} onClick={onGenerate}>
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {err && (
        <p style={{ color: "crimson", marginTop: 12 }}>
          <b>Error:</b> {err}
        </p>
      )}

      {data && (
        <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
          <section>
            <h3>Twitter</h3>
            <ul>
              {data.tweets.map((t, i) => (
                <li key={i} style={{ padding: 8, border: "1px solid #eee" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>LinkedIn</h3>
            <div style={{ whiteSpace: "pre-wrap", border: "1px solid #eee", padding: 8 }}>
              {data.linkedin}
            </div>
          </section>

          <section>
            <h3>Instagram</h3>
            <div style={{ whiteSpace: "pre-wrap", border: "1px solid #eee", padding: 8 }}>
              {data.instagram}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
