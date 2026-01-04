"use client";

import { ChangeEvent, KeyboardEvent, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  isSending?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isSending
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    autoResize();
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim() || isSending) return;
    onSend(value);
    requestAnimationFrame(autoResize);
  };

  return (
    <div className="shadow-floating relative w-full rounded-3xl border border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-end gap-3">
        <button
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-surface sm:flex"
          title="Прикрепить файлы"
        >
          <Paperclip size={18} />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Сгенерировать чип похожий на AMD Ryzen 7 7800X3D..."
          className="max-h-56 min-h-[52px] w-full resize-none bg-transparent text-base leading-6 text-neutral-900 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition",
            isSending
              ? "bg-neutral-400"
              : "bg-primary hover:brightness-95 focus:ring-2 focus:ring-primary/50"
          )}
          title="Отправить (Enter)"
        >
          <Send size={18} />
        </button>
      </div>
      <div className="mt-2 px-2 text-xs text-neutral-500">
        Enter — отправить, Shift+Enter — новая строка
      </div>
    </div>
  );
}

