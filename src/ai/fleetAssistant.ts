import OpenAI from "openai";
import { TruckStatus } from "@/types/truck";
import { fetchTrucks } from "@/api/trucks";
import { env } from "@/env";

// NOTE: In production, proxy API calls through a backend to keep the key server-side.
const openai = new OpenAI({
  apiKey: env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are Fleet Manager AI — a real-time assistant for a truck fleet management system.
You have access to live fleet data through your tools. Always call the appropriate tool before answering questions about trucks or fleet status.
Be concise, factual, and use clear formatting. When listing trucks, include their code, name, and status.`;

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
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
            ],
            description: "Filter trucks by status. Omit to get all trucks.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_fleet_stats",
      description:
        "Get a summary of fleet statistics: total count and count per status.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];

type ToolName = "get_trucks" | "get_fleet_stats";

const executeTool = async (
  name: ToolName,
  args: { status?: TruckStatus },
): Promise<string> => {
  const trucks = await fetchTrucks();

  if (name === "get_trucks") {
    const result = args.status
      ? trucks.filter((t) => t.status === args.status)
      : trucks;
    return JSON.stringify(result);
  }

  if (name === "get_fleet_stats") {
    const byStatus = (
      [
        "OUT_OF_SERVICE",
        "LOADING",
        "TO_JOB",
        "AT_JOB",
        "RETURNING",
      ] as TruckStatus[]
    ).reduce<Record<string, number>>((acc, s) => {
      acc[s] = trucks.filter((t) => t.status === s).length;
      return acc;
    }, {});
    return JSON.stringify({ total: trucks.length, byStatus });
  }

  return JSON.stringify({ error: "Unknown tool" });
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const sendMessage = async (history: ChatMessage[]): Promise<string> => {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  let currentMessages = messages;

  // Think-act-observe loop — resolve all tool calls before final answer
  for (let step = 0; step < 5; step++) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: currentMessages,
      tools,
      tool_choice: "auto",
      temperature: 0.4,
    });

    const choice = response.choices[0];

    if (choice.finish_reason !== "tool_calls") {
      return choice.message.content ?? "";
    }

    currentMessages = [...currentMessages, choice.message];

    const toolResults = await Promise.all(
      (choice.message.tool_calls ?? [])
        .filter(
          (call): call is Extract<typeof call, { type: "function" }> =>
            call.type === "function",
        )
        .map(async (call) => {
          const args = JSON.parse(call.function.arguments) as {
            status?: TruckStatus;
          };
          const result = await executeTool(
            call.function.name as ToolName,
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

  return "I wasn't able to complete the request. Please try again.";
};
