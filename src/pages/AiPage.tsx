import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessage, sendMessage } from "@/ai/fleetAssistant";
import { env } from "@/env";

const SAMPLE_QUESTIONS = [
  "What's the current fleet status summary?",
  "Which trucks are out of service?",
  "How many trucks are currently at job?",
  "Show me all trucks that are loading or returning.",
];

const hasApiKey = Boolean(env.VITE_OPENAI_API_KEY);

const useTypewriter = (text: string, speed = 12) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
};

interface AnimatedMessageProps {
  content: string;
}

const MarkdownContent = ({ content }: { content: string }) => (
  <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:font-semibold max-w-none text-sm leading-relaxed">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);

const AnimatedMessage = ({ content }: AnimatedMessageProps) => {
  const displayed = useTypewriter(content);
  return <MarkdownContent content={displayed} />;
};

export const AiPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latestId, setLatestId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(nextHistory);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      };
      setMessages([...nextHistory, assistantMsg]);
      setLatestId(assistantMsg.id);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Something went wrong. Please check your API key and try again.",
      };
      setMessages([...nextHistory, errorMsg]);
      setLatestId(errorMsg.id);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Assistant
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add your OpenAI API key to{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
            .env
          </code>{" "}
          to enable the AI assistant.
        </p>
        <code className="mx-auto block max-w-sm rounded-xl bg-gray-900 p-4 text-left text-xs text-green-400">
          VITE_OPENAI_API_KEY=sk-...
        </code>
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex max-w-3xl flex-col"
      style={{ height: "calc(100vh - 180px)" }}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          AI Fleet Assistant
        </h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Ask anything about your fleet. Powered by GPT-4o with tool calling.
        </p>
      </div>

      <div className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Ask me anything about your trucks and fleet status.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "rounded-br-sm bg-blue-600 text-white"
                  : "rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              {msg.role === "assistant" && msg.id === latestId ? (
                <AnimatedMessage content={msg.content} />
              ) : msg.role === "assistant" ? (
                <MarkdownContent content={msg.content} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-gray-700">
              <div className="flex h-5 items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your fleet... (Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50 dark:text-gray-100"
          style={{ maxHeight: "120px" }}
        />
        <button
          onClick={() => send(input)}
          disabled={isLoading || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
