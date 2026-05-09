"use client";

export default function ConsolePanel({ output }) {
  return (
    <div className="h-52 bg-black/40 border-t border-white/10 p-4 overflow-auto">

      <h2 className="text-lg font-bold mb-3">
        Output Console
      </h2>

      <pre className="font-mono text-green-400 text-sm whitespace-pre-wrap">
        {output || "Run code to see output..."}
      </pre>

    </div>
  );
}