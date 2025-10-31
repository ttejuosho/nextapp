// components/DataTable.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  themeBalham,
  AllCommunityModule,
  ModuleRegistry,
} from "ag-grid-community";
import Spinner from "@/components/Spinner";

ModuleRegistry.registerModules([AllCommunityModule]);
/**
 * GenericTable
 *
 * - serverFetch: function called with params -> should return { items: T[], total: number }
 * - columnDefs: AG Grid column definitions
 * - rowIdGetter?: (row) => string  // for stable row ids (optional)
 * - pageSizes?: number[] (defaults [10,20,50])
 * - toolbar?: ReactNode (custom controls)
 * - enableSearch?: boolean
 * - initial page/limit params
 */

export type ServerParams = {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filterField?: string;
  filterValue?: string;
  search?: string;
};

export type ServerResult<T> = {
  data: T[];
  total: number;
};

export type DataTableProps<T> = {
  columnDefs: ColDef[];
  serverFetch: (params: ServerParams) => Promise<ServerResult<T>>;
  rowIdGetter?: (row: T) => string;
  pageSizes?: number[];
  toolbar?: React.ReactNode;
  enableSearch?: boolean;
  initialPage?: number;
  initialLimit?: number;
  // UI hooks
  onRowClick?: (row: T) => void;
  className?: string;
};

export default function DataTable<T = any>({
  columnDefs,
  serverFetch,
  rowIdGetter,
  pageSizes = [10, 20, 50],
  toolbar,
  enableSearch = true,
  initialPage = 1,
  initialLimit = 10,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [rowData, setRowData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );
  const [filterField, setFilterField] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");

  const debounceRef = useRef<number | null>(null);
  const lastRequestRef = useRef(0);

  const defaultColDef = useMemo(
    () => ({ resizable: true, sortable: true, filter: true, minWidth: 100 }),
    []
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchServer = useCallback(
    async (override?: Partial<ServerParams>) => {
      setLoading(true);
      const requestId = Date.now();
      lastRequestRef.current = requestId;

      const params: ServerParams = {
        page: override?.page ?? page,
        limit: override?.limit ?? limit,
        search: override?.search ?? search,
        sortField: override?.sortField ?? sortField,
        sortOrder: override?.sortOrder ?? sortOrder,
        filterField: override?.filterField ?? filterField,
        filterValue: override?.filterValue ?? filterValue,
      };

      try {
        const res = await serverFetch(params);
        console.log("fetchServer result", res.data, res.total);
        if (lastRequestRef.current !== requestId) return;
        setRowData(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error("GenericTable fetch error", err);
        if (lastRequestRef.current !== requestId) return;
        setRowData([]);
        setTotal(0);
      } finally {
        if (lastRequestRef.current === requestId) setLoading(false);
      }
    },
    [
      page,
      limit,
      search,
      sortField,
      sortOrder,
      filterField,
      filterValue,
      serverFetch,
    ]
  );

  // initial + reactive loading with debounce for search & quick changes
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchServer({
        page,
        limit,
        search,
        sortField,
        sortOrder,
        filterField,
        filterValue,
      });
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [
    page,
    limit,
    search,
    sortField,
    sortOrder,
    filterField,
    filterValue,
    fetchServer,
  ]);

  const onGridReady = useCallback((_event: GridReadyEvent) => {
    // placeholder - could expose API ref in future
  }, []);

  const onSortChanged = useCallback((event: any) => {
    const sortModel: SortModelItem[] = event.api.getSortModel();
    if (sortModel && sortModel.length > 0) {
      setSortField(sortModel[0].colId);
      setSortOrder(sortModel[0].sort as "asc" | "desc");
    } else {
      setSortField(undefined);
      setSortOrder(undefined);
    }
    // reset to first page on sort change
    setPage(1);
  }, []);

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Show</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {pageSizes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="ml-4 hidden sm:block text-sm text-gray-600">
            Total: {total}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {enableSearch && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                className="w-full sm:w-72 border rounded px-3 py-2"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <button
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => fetchServer({ page: 1 })}
              >
                Search
              </button>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">{toolbar}</div>
        </div>
      </div>

      <div
        className="ag-theme-alpine relative"
        style={{ width: "100%", minHeight: 420 }}
      >
        {loading && (
          <div
            className="absolute z-10 flex items-center justify-center w-full"
            style={{ height: 420 }}
          >
            <Spinner size={48} />
          </div>
        )}
        <AgGridReact
          rowData={rowData}
          onGridReady={onGridReady}
          theme={themeBalham}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onSortChanged={onSortChanged}
          animateRows
          getRowId={
            rowIdGetter ? (params) => rowIdGetter(params.data) : undefined
          }
          overlayNoRowsTemplate={'<span class="text-gray-600">No rows</span>'}
          onRowClicked={(e) => onRowClick?.(e.data)}
        />
      </div>

      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="text-sm text-gray-700">
          Page {page} of {totalPages} — {total} items
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border"
            onClick={() => goToPage(1)}
            disabled={page === 1}
          >
            « First
          </button>
          <button
            className="px-3 py-1 rounded border"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            ‹ Prev
          </button>

          <input
            type="number"
            value={page}
            onChange={(e) => goToPage(Number(e.target.value || 1))}
            className="w-16 text-center border rounded px-2 py-1"
            min={1}
            max={totalPages}
          />

          <button
            className="px-3 py-1 rounded border"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next ›
          </button>
          <button
            className="px-3 py-1 rounded border"
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
}
