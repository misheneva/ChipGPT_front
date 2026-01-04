"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/input/ChatInput";
import CodeWorkspace from "@/components/editor/CodeWorkspace";
import { useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const messages = useChatStore((s) => s.messages);
  const viewMode = useChatStore((s) => s.viewMode);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const inputValue = useChatStore((s) => s.inputValue);
  const setInputValue = useChatStore((s) => s.setInputValue);
  const isSending = useChatStore((s) => s.isSending);
  const setViewMode = useChatStore((s) => s.setViewMode);

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 overflow-hidden">
          <section
            className={cn(
              "flex flex-1 flex-col overflow-hidden border-neutral-200",
              viewMode === "workspace"
                ? "lg:w-1/2 border-r"
                : "w-full border-r"
            )}
          >
            <div className="flex-1 overflow-y-auto">
              <MessageList messages={messages} />
            </div>
            <div className="sticky bottom-0 p-4">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={sendMessage}
                isSending={isSending}
              />
            </div>
          </section>
          <section
            className={cn(
              "hidden h-full flex-1 lg:flex",
              viewMode === "workspace" ? "max-w-[50vw]" : "max-w-0"
            )}
          >
            {viewMode === "workspace" && (
              <CodeWorkspace onClose={() => setViewMode("chat")} />
            )}
          </section>
        </main>
        {viewMode === "workspace" && (
          <div className="flex items-center justify-center border-t border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-600 lg:hidden">
            Рабочая область доступна на широком экране (≥1024px).
          </div>
        )}
      </div>
    </div>
  );
}

