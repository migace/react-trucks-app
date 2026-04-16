import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

const MAX_BODY_SIZE = 256 * 1024; // 256 KB

interface ChatMessage {
  role: string;
  content: string;
}

interface ToolDefinition {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface ToolCall {
  id: string;
  type: string;
  function: { name: string; arguments: string };
}

interface OpenAIChoice {
  finish_reason: string;
  message: {
    content: string | null;
    tool_calls?: ToolCall[];
  };
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
}

interface ChatRequestBody {
  messages: ChatMessage[];
  tools: ToolDefinition[];
}

interface TruckRecord {
  status: string;
  id: string;
  code: string;
  name: string;
  description: string;
}

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
          const body = await readBody(req, MAX_BODY_SIZE);
          const parsed: unknown = safeParse(body);

          if (!isValidChatRequest(parsed)) {
            sendJson(res, 400, {
              error:
                "Invalid request body: expected { messages: [], tools: [] }",
            });
            return;
          }

          const { messages, tools } = parsed;

          // Think-act-observe loop — resolve tool calls server-side
          let currentMessages: unknown[] = messages;
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
                .filter((call) => call.type === "function")
                .map(async (call) => {
                  const args = safeParse(call.function.arguments) as {
                    status?: string;
                  };
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
                }),
            );

            currentMessages = [...currentMessages, ...toolResults];
          }

          sendJson(res, 200, {
            content: "I wasn't able to complete the request. Please try again.",
          });
        } catch (err) {
          if (
            err instanceof Error &&
            err.message === "Request body too large"
          ) {
            sendJson(res, 413, { error: "Request body too large" });
            return;
          }
          console.error("[ai-proxy]", err);
          sendJson(res, 500, { error: "AI proxy request failed" });
        }
      });
    },
  };
}

function isValidChatRequest(data: unknown): data is ChatRequestBody {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return Array.isArray(obj.messages) && Array.isArray(obj.tools);
}

async function callOpenAI(
  apiKey: string,
  messages: unknown[],
  tools: unknown[],
): Promise<OpenAIResponse> {
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

  return response.json() as Promise<OpenAIResponse>;
}

async function executeTool(
  apiUrl: string,
  name: string,
  args: { status?: string },
): Promise<string> {
  const trucksRes = await fetch(`${apiUrl}/trucks`);
  if (!trucksRes.ok) return JSON.stringify({ error: "Failed to fetch trucks" });
  const trucks = (await trucksRes.json()) as TruckRecord[];

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

function readBody(req: IncomingMessage, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxSize) {
        req.destroy();
        reject(new Error("Request body too large"));
        return;
      }
      data += chunk.toString();
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function safeParse(json: string): unknown {
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
