"use client";

import { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setMode("edit")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            mode === "edit"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMode("preview")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            mode === "preview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="min-h-96">
        {mode === "edit" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your markdown here..."
          />
        ) : (
          <MarkdownPreview content={value} />
        )}
      </div>
    </div>
  );
}
