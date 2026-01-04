"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn, detectLanguage } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  onOpenInEditor?: (code: string, language: string) => void;
}

export function MarkdownRenderer({
  content,
  onOpenInEditor
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose prose-neutral max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-code:before:hidden prose-code:after:hidden"
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeHighlight, rehypeKatex]}
      components={{
        code({ inline, className, children, ...props }) {
          const text = String(children ?? "");
          if (inline) {
            return (
              <code
                className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-sm text-neutral-900"
                {...props}
              >
                {text}
              </code>
            );
          }

          const lang = detectLanguage(className?.replace("language-", ""));
          const lines = text.split("\n").length;

          return (
            <div className="group relative">
              <pre
                className={cn(
                  "rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm leading-relaxed",
                  className
                )}
              >
                <code {...props}>{text}</code>
              </pre>
              {onOpenInEditor && (
                <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-surface"
                    onClick={() => onOpenInEditor(text, lang)}
                    title="Открыть код в рабочей области"
                  >
                    Open in Editor {lines > 12 ? "↗" : ""}
                  </button>
                </div>
              )}
            </div>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

