import { create } from "zustand";
import { streamChatCompletion } from "./api";
import { extractCodeBlocks } from "./utils";
import {
  Artifact,
  ChatHistoryItem,
  Message,
  SupportedLanguage,
  ViewMode
} from "./types";

interface ChatState {
  messages: Message[];
  history: ChatHistoryItem[];
  viewMode: ViewMode;
  artifact?: Artifact;
  inputValue: string;
  isSending: boolean;
  setViewMode: (mode: ViewMode) => void;
  setInputValue: (value: string) => void;
  setArtifactCode: (code: string) => void;
  resetSession: () => void;
  sendMessage: (content: string) => Promise<void>;
  generateTestbench: () => Promise<void>;
}

const seededHistory: ChatHistoryItem[] = [
  { id: "today-1", title: "SPI master (Verilog)", createdAt: "Сегодня" },
  { id: "yday-1", title: "FFT pipeline (SystemVerilog)", createdAt: "Вчера" }
];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  history: seededHistory,
  viewMode: "zero",
  artifact: undefined,
  inputValue: "",
  isSending: false,
  setViewMode: (mode) => set({ viewMode: mode }),
  setInputValue: (value) => set({ inputValue: value }),
  setArtifactCode: (code) =>
    set((state) =>
      state.artifact
        ? { artifact: { ...state.artifact, code } }
        : { artifact: state.artifact }
    ),
  resetSession: () =>
    set({
      messages: [],
      artifact: undefined,
      viewMode: "zero",
      inputValue: ""
    }),
  sendMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const prevMessages = get().messages;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now()
    };
    const assistantId = crypto.randomUUID();
    const placeholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true
    };

    set({
      messages: [...prevMessages, userMessage, placeholder],
      viewMode: "chat",
      isSending: true,
      inputValue: ""
    });

    try {
      await streamChatCompletion(prevMessages, trimmed, (token) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + token } : m
          )
        }));
      });
    } catch (err) {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "⚠️ Не удалось получить ответ. Проверьте бекенд или попробуйте позже.",
                isStreaming: false
              }
            : m
        ),
        isSending: false
      }));
      return;
    }

    const assistantMessage = get().messages.find((m) => m.id === assistantId);
    const blocks = assistantMessage
      ? extractCodeBlocks(assistantMessage.content)
      : [];

    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      ),
      isSending: false,
      viewMode: blocks.length > 0 ? "workspace" : "chat",
      artifact:
        blocks.length > 0
          ? ({
              code: blocks[0].code,
              language: blocks[0].language,
              title: "HDL Artifact",
              readOnly: false
            } satisfies Artifact)
          : state.artifact
    }));
  },
  generateTestbench: async () => {
    const artifact = get().artifact;
    if (!artifact) return;
    const prompt = `Сгенерируй компактный testbench для следующего ${artifact.language} модуля. Не меняй интерфейс, добавь комментарии и разумные тесты:\n\`\`\`${artifact.language}\n${artifact.code}\n\`\`\``;
    await get().sendMessage(prompt);
  }
}));

