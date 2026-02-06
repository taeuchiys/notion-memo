import { prisma } from "@/lib/prisma";
import NotesTable from "@/components/notes/NotesTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Notes</h1>
          <Link
            href="/notes/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            New Note
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <NotesTable notes={notes} />
        </div>
      </div>
    </div>
  );
}
