"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  RowSelectionModule,
  AllCommunityModule,
} from "ag-grid-community";
import { themeBalham } from "ag-grid-community";
import { Mail } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AGTableProps<T> {
  columns: any[];
  fetchData: (params: {
    page: number;
    pageSize: number;
    search?: string;
  }) => Promise<{ data: T[]; total: number }>;
  initialPage?: number;
  pageSize?: number;
  searchEnabled?: boolean;
}

export default function AGTable<T>({
  columns,
  fetchData,
  initialPage = 1,
  rowsPerPage = 100,
}: AGTableProps<T>) {
  const gridRef = useRef<any>(null);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPage);

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData({ page, pageSize, search });
      setData(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  const onGridReady = (params: any) => {
    gridRef.current = params.api;
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSendEmail = () => {
    const selected = gridRef.current?.getSelectedRows() || [];
    if (selected.length === 0) {
      alert("No rows selected.");
      return;
    }
    const selectedEmails = selected.map((row: any) => row.userEmail);

    console.log("Sending email to: ", selectedEmails);
    // TODO: call backend API to send emails
  };

  const enhancedColumns = [
    {
      field: "__options",
      headerName: "",
      width: 60,
      cellRenderer: (params: any) => (
        <Mail
          className="w-4 h-4 text-blue-300 hover:text-blue-500 cursor-pointer"
          onClick={() => handleSendEmail([params.data.userEmail])}
        />
      ),
      suppressMenu: true,
      sortable: false,
      filter: false,
      pinned: "left",
    },
    ...columns,
  ];

  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="w-full">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-3 p-2 border rounded w-64"
      />

      {/* Action Button */}
      <button
        onClick={handleSendEmail}
        className="mb-3 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Send Email to Selected
      </button>

      <div
        className="ag-theme-balham"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          theme={themeBalham}
          rowData={data}
          columnDefs={enhancedColumns}
          onGridReady={onGridReady}
          rowSelection={rowSelection} // <-- enables selecting many rows
          paginationPageSize={rowsPerPage}
        />
      </div>

      {/* Pagination Controls */}
      <div className="mt-3 flex justify-end items-center gap-4 text-sm text-gray-700">
        {/* Rows Per Page */}
        <div className="flex items-center gap-2">
          <span>Page Size:</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[50, 100, 150, 200].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* First */}
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage(1)}
        >
          ⏮
        </button>

        {/* Prev */}
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {/* Page Info */}
        <span>
          Page <strong>{page}</strong> of{" "}
          <strong>{Math.ceil(total / pageSize)}</strong>
          <span className="mx-2 text-gray-400">•</span>
          Total: <strong>{total}</strong>
        </span>

        {/* Next */}
        <button
          className="px-2 py-1 border rounded disabled:opacity-40"
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

        {/* Last */}
        <button
          className="px-2 py-1 border rounded disabled:opacity-40"
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => setPage(Math.ceil(total / pageSize))}
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
