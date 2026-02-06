"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Note } from "@/types/note";
import { formatDate } from "@/lib/date-utils";
import Link from "next/link";

interface NotesTableProps {
  notes: Note[];
}

export default function NotesTable({ notes }: NotesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "project",
      header: "Project",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "kind",
      header: "Kind",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: (info) => {
        const tags = info.getValue() as string[];
        return tags.join(", ");
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (info) => {
        const date = info.getValue() as Date;
        return formatDate(date);
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: (info) => {
        const date = info.getValue() as Date;
        return formatDate(date);
      },
    },
  ];

  const table = useReactTable({
    data: notes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {table.getAllLeafColumns().map((column) => (
          <label key={column.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
              className="w-4 h-4"
            />
            <span className="text-sm">{column.columnDef.header as string}</span>
          </label>
        ))}
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-gray-200 select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="text-xs">
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
              <Link href={`/notes/${row.original.id}`} key={row.id}>
                <tr className="border-b hover:bg-gray-50 cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notes yet. Create one to get started.
        </div>
      )}
    </div>
  );
}
