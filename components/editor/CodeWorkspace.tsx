"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import {
  Copy,
  Download,
  FileDiff,
  FlaskConical,
  X
} from "lucide-react";
import { useChatStore } from "@/lib/store";
import { extractPorts } from "@/lib/utils";
import PinoutVisualizer from "../common/PinoutVisualizer";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false
});

const languageOptions = [
  { label: "Verilog", value: "verilog" },
  { label: "SystemVerilog", value: "systemverilog" },
  { label: "VHDL", value: "vhdl" }
];

interface CodeWorkspaceProps {
  onClose?: () => void;
}

export default function CodeWorkspace({ onClose }: CodeWorkspaceProps) {
  const artifact = useChatStore((s) => s.artifact);
  const setArtifactCode = useChatStore((s) => s.setArtifactCode);
  const generateTestbench = useChatStore((s) => s.generateTestbench);
  const viewMode = useChatStore((s) => s.viewMode);

  const ports = useMemo(
    () => (artifact ? extractPorts(artifact.code) : []),
    [artifact]
  );

  if (!artifact || viewMode !== "workspace") {
    return (
      <div className="flex flex-1 items-center justify-center border-l border-neutral-200 bg-white/80 text-neutral-500">
        Рабочая область появится, когда ассистент вернёт HDL-код.
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(artifact.code);
  };

  const handleDownload = () => {
    const ext =
      artifact.language === "vhdl"
        ? ".vhd"
        : artifact.language === "systemverilog"
          ? ".sv"
          : ".v";
    const blob = new Blob([artifact.code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `artifact${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDiff = () => {
    alert("Diff stub: подключите историю версий бэкенда для реального сравнения.");
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-neutral-200 bg-white">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-neutral-900">
            {artifact.title ?? "HDL Artifact"}
          </div>
          <div className="text-xs text-neutral-500">
            {artifact.language.toUpperCase()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-surface"
          >
            <Copy size={16} className="inline-block" /> Copy
          </button>
          <button
            onClick={handleDownload}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-surface"
          >
            <Download size={16} className="inline-block" /> Download
          </button>
          <button
            onClick={handleDiff}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-surface"
          >
            <FileDiff size={16} className="inline-block" /> Diff
          </button>
          <button
            onClick={generateTestbench}
            className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-95"
            title="Сгенерировать testbench"
          >
            <FlaskConical size={16} className="inline-block" /> Testbench
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-surface"
              title="Скрыть рабочую область"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2 text-xs text-neutral-600">
          <span className="font-medium">Язык:</span>
          <div className="flex gap-1">
            {languageOptions.map((option) => (
              <span
                key={option.value}
                className={`rounded-full px-2 py-1 ${
                  option.value === artifact.language
                    ? "bg-primary/10 text-primary"
                    : "bg-surface text-neutral-700"
                }`}
              >
                {option.label}
              </span>
            ))}
          </div>
          <span className="ml-auto text-neutral-400 text-[11px]">
            ReadOnly: {artifact.readOnly ? "Да" : "Нет"}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            defaultLanguage={artifact.language === "vhdl" ? "vhdl" : "verilog"}
            language={artifact.language === "vhdl" ? "vhdl" : "verilog"}
            value={artifact.code}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              readOnly: artifact.readOnly,
              wordWrap: "off"
            }}
            theme="vs"
            onChange={(value) => setArtifactCode(value || "")}
          />
        </div>
        <div className="border-t border-neutral-200 px-4 pb-4 pt-2">
          <PinoutVisualizer ports={ports} />
        </div>
      </div>
    </div>
  );
}

