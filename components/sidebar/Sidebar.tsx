"use client";

import { useMemo, useState } from "react";
import { Plus, ChevronLeft } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const history = useChatStore((s) => s.history);
  const resetSession = useChatStore((s) => s.resetSession);

  const grouped = useMemo(() => {
    return history.reduce<Record<string, typeof history>>((acc, item) => {
      if (!acc[item.createdAt]) acc[item.createdAt] = [];
      acc[item.createdAt].push(item);
      return acc;
    }, {});
  }, [history]);

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen shrink-0 flex-col border-r border-neutral-200 bg-white/80 backdrop-blur transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-3 py-4">
        {!collapsed && <span className="text-sm font-semibold">Диалоги</span>}
        <div className="flex items-center gap-2">
          <button
            onClick={resetSession}
            className={cn(
              "inline-flex items-center justify-center rounded-full bg-primary text-white transition hover:brightness-95",
              collapsed ? "h-10 w-10" : "h-10 px-3 text-sm font-medium"
            )}
            title="Новый чат"
          >
            <Plus size={18} />
            {!collapsed && <span className="ml-2">New Chat</span>}
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-full border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-100"
            title={collapsed ? "Развернуть" : "Свернуть"}
          >
            <ChevronLeft
              size={18}
              className={cn("transition", collapsed ? "rotate-180" : "")}
            />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label} className="mb-4">
            {!collapsed && (
              <div className="mb-2 px-2 text-xs uppercase text-neutral-500">
                {label}
              </div>
            )}
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "w-full rounded-xl border border-transparent bg-surface/80 px-3 py-2 text-left text-sm text-neutral-800 hover:border-neutral-200 hover:bg-white",
                    collapsed && "justify-center"
                  )}
                  title={item.title}
                >
                  {collapsed ? "•" : item.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

