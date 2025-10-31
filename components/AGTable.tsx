"use client";

import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { themeBalham } from "ag-grid-community";

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
  searchEnabled = true,
}: AGTableProps<T>) {
  const gridRef = useRef<any>(null);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(rowsPerPage);

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

  // const onPaginationChanged = () => {
  //   if (!gridRef.current) return;
  //   const currentPage = gridRef.current.paginationGetCurrentPage() + 1;
  //   setPage(currentPage);
  // };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="w-full">
      {searchEnabled && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={onSearchChange}
          className="mb-2 p-2 border rounded w-64"
        />
      )}

      <div
        className="ag-theme-balham"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          theme={themeBalham}
          rowData={data}
          columnDefs={columns}
          onGridReady={onGridReady}
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
