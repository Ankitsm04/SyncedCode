"use client";

import { Home, FileCode, StickyNote, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-20 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col items-center py-6 gap-8">

      <div className="text-2xl font-bold">
        ⚡
      </div>

      <div className="flex flex-col gap-6 text-zinc-400">

        <button className="hover:text-white transition">
          <Home size={24} />
        </button>

        <button className="hover:text-white transition">
          <FileCode size={24} />
        </button>

        <button className="hover:text-white transition">
          <StickyNote size={24} />
        </button>

        <button className="hover:text-white transition">
          <Settings size={24} />
        </button>

      </div>

    </div>
  );
}