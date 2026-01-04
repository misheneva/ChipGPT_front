import { Message } from "./types";

interface CompletionPayload {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  model: string;
  stream: boolean;
}

export async function streamChatCompletion(
  messages: Message[],
  prompt: string,
  onToken: (token: string) => void
) {
  const payload: CompletionPayload = {
    messages: [...messages, { role: "user", content: prompt }],
    model: "qwen-coder-verilog",
    stream: true
  };

  const response = await fetch("/api/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    throw new Error("Не удалось подключиться к стриму ответа");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    const chunks = text.split("\n");
    for (const chunk of chunks) {
      const clean = chunk.replace(/^data:\s*/, "").trim();
      if (!clean) continue;
      onToken(clean);
    }
  }
}

