export type Role = "user" | "assistant";

export type ViewMode = "zero" | "chat" | "workspace";

export type SupportedLanguage = "verilog" | "systemverilog" | "vhdl" | "plain";

export interface CodeBlock {
  language: SupportedLanguage;
  code: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  isStreaming?: boolean;
  codeBlocks?: CodeBlock[];
}

export interface Artifact {
  title?: string;
  code: string;
  language: SupportedLanguage;
  readOnly: boolean;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
}

