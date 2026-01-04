"use client";

import { Port } from "@/lib/utils";

interface PinoutVisualizerProps {
  ports: Port[];
}

export default function PinoutVisualizer({ ports }: PinoutVisualizerProps) {
  const inputs = ports.filter((p) => p.direction === "input");
  const outputs = ports.filter((p) => p.direction === "output");

  if (!ports.length) return null;

  return (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-neutral-800">
        Pinout (auto)
      </div>
      <div className="relative flex items-center justify-between">
        <div className="space-y-2 text-right">
          {inputs.map((port) => (
            <div key={port.name} className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">IN</span>
              <span className="rounded-md bg-surface px-2 py-1 font-mono text-sm text-neutral-800">
                {port.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-neutral-200 bg-surface text-sm font-semibold text-neutral-700">
          Module
        </div>
        <div className="space-y-2 text-left">
          {outputs.map((port) => (
            <div key={port.name} className="flex items-center gap-2">
              <span className="rounded-md bg-surface px-2 py-1 font-mono text-sm text-neutral-800">
                {port.name}
              </span>
              <span className="text-xs text-neutral-500">OUT</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

