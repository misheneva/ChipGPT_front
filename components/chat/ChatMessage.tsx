"use client";

import { Message, SupportedLanguage } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn, detectLanguage } from "@/lib/utils";
import { useChatStore } from "@/lib/store";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const setViewMode = useChatStore((s) => s.setViewMode);
  const setArtifactCode = useChatStore((s) => s.setArtifactCode);

  const handleOpenInEditor = (code: string, lang: string) => {
    setViewMode("workspace");
    setArtifactCode(code);
    // ensure artifact exists even if we force-open from inline block
    // fallback language detection on click
    const language = detectLanguage(lang) as SupportedLanguage;
    useChatStore.setState((state) => ({
      artifact: state.artifact ?? {
        code,
        language,
        title: "HDL Artifact",
        readOnly: false
      }
    }));
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-3xl bubble",
          message.role === "user"
            ? "bg-surface text-neutral-900"
            : "bg-white text-neutral-900 border border-neutral-200"
        )}
      >
        <MarkdownRenderer
          content={message.content || "…"}
          onOpenInEditor={handleOpenInEditor}
        />
        {message.isStreaming && (
          <div className="mt-2 h-4 w-16 animate-pulse rounded bg-neutral-200" />
        )}
      </div>
    </div>
  );
}

