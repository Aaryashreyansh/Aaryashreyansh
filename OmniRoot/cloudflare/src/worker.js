const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, provider: "Cloudflare Workers AI", model: DEFAULT_MODEL });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON request." }, 400);
      }

      const prompt = typeof body.message === "string" ? body.message.trim() : "";
      if (!prompt || prompt.length > 8000) {
        return json({ error: "Message must contain 1 to 8000 characters." }, 400);
      }

      if (!env.AI) {
        return json({ error: "Workers AI binding is missing. Check the Cloudflare project configuration." }, 503);
      }

      try {
        const result = await env.AI.run(DEFAULT_MODEL, {
          messages: [
            { role: "system", content: "You are OmniRoot, a helpful, accurate AI assistant. Be clear and concise." },
            { role: "user", content: prompt }
          ],
          max_tokens: 900
        });
        const reply = result?.response || result?.output?.[0]?.content?.[0]?.text || "";
        if (!reply) return json({ error: "The AI provider returned an empty response." }, 502);
        return json({ reply, provider: "Cloudflare Workers AI", model: DEFAULT_MODEL });
      } catch (error) {
        return json({
          error: "AI request failed or the account quota was reached. Check Cloudflare Workers AI usage and try again later."
        }, 429);
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "API route not found." }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};