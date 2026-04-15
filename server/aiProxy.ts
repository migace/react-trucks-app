import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Vite dev-server plugin that proxies AI chat requests to OpenAI,
 * keeping the API key server-side (never shipped to the browser).
 *
 * In production, replace this with an equivalent edge function / API route.
 */
export function aiProxyPlugin(): Plugin {
  return {
    name: "ai-proxy",
    configureServer(server) {
      server.middlewares.use("/api/ai/chat", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          sendJson(res, 500, {
            error: "OPENAI_API_KEY not set in server environment",
          });
          return;
        }

        try {
          const body = await readBody(req);
          const { messages, tools } = JSON.parse(body);

          // Think-act-observe loop — resolve tool calls server-side
          let currentMessages = messages;
          const API_URL = process.env.VITE_API_URL ?? "http://localhost:3000";

          for (let step = 0; step < 5; step++) {
            const completion = await callOpenAI(apiKey, currentMessages, tools);
            const choice = completion.choices[0];

            if (choice.finish_reason !== "tool_calls") {
              sendJson(res, 200, { content: choice.message.content ?? "" });
              return;
            }

            currentMessages = [...currentMessages, choice.message];

            const toolResults = await Promise.all(
              (choice.message.tool_calls ?? [])
                .filter((call: { type: string }) => call.type === "function")
                .map(
                  async (call: {
                    id: string;
                    function: { name: string; arguments: string };
                  }) => {
                    const args = safeParse(call.function.arguments);
                    const result = await executeTool(
                      API_URL,
                      call.function.name,
                      args,
                    );
                    return {
                      role: "tool" as const,
                      tool_call_id: call.id,
                      content: result,
                    };
                  },
                ),
            );

            currentMessages = [...currentMessages, ...toolResults];
          }

          sendJson(res, 200, {
            content: "I wasn't able to complete the request. Please try again.",
          });
        } catch (err) {
          console.error("[ai-proxy]", err);
          sendJson(res, 500, { error: "AI proxy request failed" });
        }
      });
    },
  };
}

async function callOpenAI(
  apiKey: string,
  messages: unknown[],
  tools: unknown[],
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${text}`);
  }

  return response.json();
}

async function executeTool(
  apiUrl: string,
  name: string,
  args: { status?: string },
): Promise<string> {
  const trucksRes = await fetch(`${apiUrl}/trucks`);
  if (!trucksRes.ok) return JSON.stringify({ error: "Failed to fetch trucks" });
  const trucks = (await trucksRes.json()) as Array<{
    status: string;
    [key: string]: unknown;
  }>;

  if (name === "get_trucks") {
    const result = args.status
      ? trucks.filter((t) => t.status === args.status)
      : trucks;
    return JSON.stringify(result);
  }

  if (name === "get_fleet_stats") {
    const statuses = [
      "OUT_OF_SERVICE",
      "LOADING",
      "TO_JOB",
      "AT_JOB",
      "RETURNING",
    ];
    const byStatus: Record<string, number> = {};
    for (const s of statuses) {
      byStatus[s] = trucks.filter((t) => t.status === s).length;
    }
    return JSON.stringify({ total: trucks.length, byStatus });
  }

  return JSON.stringify({ error: "Unknown tool" });
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => (data += chunk.toString()));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function safeParse(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
