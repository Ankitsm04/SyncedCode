"use client";

import {
  useEditor,
  EditorContent,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import { useEffect } from "react";

export default function NotesPanel({
  notes,
  setNotes,
}) {

  /*
  CREATE EDITOR
  */
  const editor = useEditor({
    extensions: [StarterKit],

    content: notes,

    immediatelyRender: false,

    onUpdate: ({ editor }) => {

      const html = editor.getHTML();

      setNotes(html);

    },
  });

  /*
  SYNC NOTES
  */
  useEffect(() => {

    if (!editor) return;

    /*
    PREVENT LOOP
    */
    if (editor.getHTML() !== notes) {

      editor.commands.setContent(notes);

    }

  }, [notes, editor]);

  if (!editor) return null;

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg border-t border-white/10">

      {/* TOOLBAR */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 flex-wrap">

        <h2 className="text-lg font-bold mr-4">
          SyncedNotes Tab
        </h2>

        <button
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700 transition"
        >
          Bold
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700 transition"
        >
          Italic
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700 transition"
        >
          H1
        </button>

      </div>

      {/* EDITOR */}
      <div className="flex-1 overflow-auto p-5">

        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none outline-none min-h-full"
        />

      </div>

    </div>
  );
}