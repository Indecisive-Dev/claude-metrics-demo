import { TINYBIRD_CONFIG } from "../src/shared/config.js";

const PORT = process.env.DASHBOARD_PORT || 3000;

const ENDPOINTS = [
  "prompts_per_day",
  "prompts_per_hour",
  "avg_words_per_prompt",
  "avg_chars_per_prompt",
  "avg_tokens_per_prompt",
];

async function fetchTinybird(endpoint: string): Promise<unknown> {
  const url = `${TINYBIRD_CONFIG.host}/v0/pipes/${endpoint}.json`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TINYBIRD_CONFIG.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Tinybird error: ${response.status}`);
  }

  return response.json();
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // API routes
    if (url.pathname.startsWith("/api/")) {
      const endpoint = url.pathname.replace("/api/", "");

      if (!ENDPOINTS.includes(endpoint)) {
        return new Response(JSON.stringify({ error: "Unknown endpoint" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const data = await fetchTinybird(endpoint);
        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: String(error) }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Serve static files
    let filePath = url.pathname;
    if (filePath === "/") {
      filePath = "/index.html";
    }

    const file = Bun.file(`${import.meta.dir}/public${filePath}`);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Dashboard running at http://localhost:${server.port}`);
