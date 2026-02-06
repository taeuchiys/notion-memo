"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Note } from "@/types/note";
import { formatDate } from "@/lib/date-utils";
import { useRouter } from "next/navigation";

interface NotesTableProps {
  notes: Note[];
}

export default function NotesTable({ notes }: NotesTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterText, setFilterText] = useState("");

  const filteredNotes = useMemo(() => {
    if (!filterText.trim()) return notes;

    const query = filterText.trim().toLowerCase();
    return notes.filter((note) => {
      if (query.startsWith("title:")) {
        const searchValue = query.slice(6);
        return note.title.toLowerCase().includes(searchValue);
      }
      if (query.startsWith("project:")) {
        const searchValue = query.slice(8);
        return note.project.toLowerCase().includes(searchValue);
      }
      if (query.startsWith("kind:")) {
        const searchValue = query.slice(5);
        return note.kind.toLowerCase().includes(searchValue);
      }
      if (query.startsWith("tag:")) {
        const searchValue = query.slice(4);
        return note.tags.some((tag) =>
          tag.toLowerCase().includes(searchValue)
        );
      }
      return note.title.toLowerCase().includes(query);
    });
  }, [notes, filterText]);

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => info.getValue(),
      size: 200,
      minSize: 150,
    },
    {
      accessorKey: "project",
      header: "Project",
      cell: (info) => info.getValue(),
      size: 150,
      minSize: 100,
    },
    {
      accessorKey: "kind",
      header: "Kind",
      cell: (info) => info.getValue(),
      size: 120,
      minSize: 80,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: (info) => {
        const tags = info.getValue() as string[];
        return tags.join(", ");
      },
      size: 200,
      minSize: 100,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (info) => {
        const date = info.getValue() as Date;
        return formatDate(date);
      },
      size: 160,
      minSize: 140,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: (info) => {
        const date = info.getValue() as Date;
        return formatDate(date);
      },
      size: 160,
      minSize: 140,
    },
  ];

  const table = useReactTable({
    data: filteredNotes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder='Search: "title:xxx" or "project:xxx" or "kind:xxx" or "tag:xxx" or plain text for title'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filterText && (
          <p className="mt-1 text-xs text-gray-600">
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
        )}
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-gray-200 select-none border-r last:border-r-0 whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="text-xs flex-shrink-0">
                        {header.column.getIsSorted() === "asc"
                          ? "↑"
                          : header.column.getIsSorted() === "desc"
                            ? "↓"
                            : ""}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/notes/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm border-r last:border-r-0 overflow-hidden overflow-ellipsis"
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.columnDef.minSize,
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredNotes.length === 0 && notes.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No notes match your filter.
        </div>
      )}

      {notes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notes yet. Create one to get started.
        </div>
      )}
    </div>
  );
}
