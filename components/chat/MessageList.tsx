"use client";

import { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import { useChatStore } from "@/lib/store";

interface MessageListProps {
  messages: Message[];
}

const promptSuggestions = [
  "Сгенерируй SPI master на Verilog с параметром ширины слова",
  "Объясни оптимизацию FSM для синтеза",
  "Сделай SystemVerilog testbench для UART",
  "Нарисуй пиновку для простого ALU"
];

export default function MessageList({ messages }: MessageListProps) {
  const setInputValue = useChatStore((s) => s.setInputValue);
  const sendMessage = useChatStore((s) => s.sendMessage);

  if (!messages.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-floating">
          ChipGPT
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-semibold text-neutral-900">
            ChipGPT Workspace
          </div>
          <p className="text-neutral-500">
            Генерируйте чипы, правьте и проверяйте их код на Verilog / VHDL / SystemVerilog.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {promptSuggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInputValue(prompt);
                sendMessage(prompt);
              }}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-6 py-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
}

