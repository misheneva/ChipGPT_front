import { NextRequest } from "next/server";

const exampleChunks = [
  "Конечно, вот модуль счётчика для верификации:\n\n",
  "```verilog\n",
  "module counter #(\n",
  "  parameter WIDTH = 8\n",
  ")(\n",
  "  input  wire              clk,\n",
  "  input  wire              rst_n,\n",
  "  input  wire              enable,\n",
  "  output reg  [WIDTH-1:0]  q\n",
  ");\n\n",
  "  always @(posedge clk or negedge rst_n) begin\n",
  "    if (!rst_n) q <= '0;\n",
  "    else if (enable) q <= q + 1'b1;\n",
  "  end\n",
  "endmodule\n",
  "```\n\n",
  "Готово. Добавить testbench?"
];

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  // small guard to keep lint happy about unused
  await req.json().catch(() => ({}));

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of exampleChunks) {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        await new Promise((res) => setTimeout(res, 60));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

