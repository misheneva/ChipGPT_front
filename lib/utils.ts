import { SupportedLanguage, CodeBlock } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function detectLanguage(lang?: string | null): SupportedLanguage {
  if (!lang) return "plain";
  const normalized = lang.toLowerCase();
  if (normalized.includes("systemverilog") || normalized === "sv") {
    return "systemverilog";
  }
  if (normalized.includes("verilog") || normalized === "v") {
    return "verilog";
  }
  if (normalized.includes("vhdl")) return "vhdl";
  return "plain";
}

export function extractCodeBlocks(content: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```(\w+)?\n([\s\S]*?)```/gim;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const language = detectLanguage(match[1] ?? undefined);
    const code = match[2].trimEnd();
    blocks.push({ language, code });
  }
  return blocks;
}

export interface Port {
  name: string;
  direction: "input" | "output";
}

export function extractPorts(code: string): Port[] {
  const ports: Port[] = [];
  const regex =
    /(input|output)\s+(?:wire|reg|logic)?\s*(?:\[[^\]]+\]\s*)?([a-zA-Z_]\w*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    ports.push({ direction: match[1] as "input" | "output", name: match[2] });
  }
  return ports;
}

