import { TruckStatus } from "@/types/truck";

const SYSTEM_PROMPT = `You are Fleet Manager AI — a real-time assistant for a truck fleet management system.
You have access to live fleet data through your tools. Always call the appropriate tool before answering questions about trucks or fleet status.
Be concise, factual, and use clear formatting. When listing trucks, include their code, name, and status.`;

const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_trucks",
      description:
        "Fetch all trucks from the fleet, optionally filtered by status.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: [
              "OUT_OF_SERVICE",
              "LOADING",
              "TO_JOB",
              "AT_JOB",
              "RETURNING",
            ] satisfies TruckStatus[],
            description: "Filter trucks by status. Omit to get all trucks.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_fleet_stats",
      description:
        "Get a summary of fleet statistics: total count and count per status.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const sendMessage = async (
  history: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> => {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, tools }),
    signal,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(
      (error as { error?: string }).error ??
        `AI request failed (${res.status})`,
    );
  }

  const data = (await res.json()) as { content: string };
  return data.content;
};
