// api/ping.ts
export const config = { runtime: "edge" };

export default async function handler() {
  return new Response(JSON.stringify({ ok: true, env: !!process.env.OPENAI_API_KEY }), {
    headers: { "content-type": "application/json" },
  });
}
