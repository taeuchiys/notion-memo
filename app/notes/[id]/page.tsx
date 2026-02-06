"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/notes/MarkdownEditor";
import { Note } from "@/types/note";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NotePage({ params: paramsPromise }: NotePageProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    paramsPromise.then((params) => setId(params.id));
  }, [paramsPromise]);

  const isNewNote = id === "new";

  useEffect(() => {
    if (!id) return;

    if (isNewNote) {
      setNote({
        id: "",
        title: "",
        content: "",
        project: "",
        tags: [],
        kind: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setLoading(false);
    } else {
      fetchNote(id);
    }
  }, [id, isNewNote]);

  const fetchNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) throw new Error("Failed to fetch note");
      const data = await response.json();
      setNote(data);
    } catch (error) {
      console.error("Error fetching note:", error);
      alert("Failed to load note");
      router.push("/notes");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note || !note.title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const method = isNewNote ? "POST" : "PUT";
      const endpoint = isNewNote ? "/api/notes" : `/api/notes/${note.id}`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          project: note.project,
          tags: note.tags.length > 0 ? note.tags : [],
          kind: note.kind,
        }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      const savedNote = await response.json();
      alert(isNewNote ? "Note created successfully" : "Note saved successfully");

      if (isNewNote) {
        router.push(`/notes/${savedNote.id}`);
      } else {
        setNote(savedNote);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note || isNewNote) return;

    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      alert("Note deleted successfully");
      router.push("/notes");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!note) {
    return <div className="text-center py-8">Note not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/notes")}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Notes
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Note title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project
                  </label>
                  <input
                    type="text"
                    value={note.project}
                    onChange={(e) =>
                      setNote({ ...note, project: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kind
                  </label>
                  <input
                    type="text"
                    value={note.kind}
                    onChange={(e) => setNote({ ...note, kind: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kind/Type"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={note.tags.join(", ")}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <MarkdownEditor
                  value={note.content}
                  onChange={(content) => setNote({ ...note, content })}
                />
              </div>

              <div className="flex gap-4 justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  {!isNewNote && (
                    <button
                      onClick={handleDelete}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
