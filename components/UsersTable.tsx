// components/UsersTable.tsx
"use client";
import React, { useCallback, useMemo } from "react";
import DataTable, { ServerParams, ServerResult } from "./DataTable";
import AGTable from "./AGTable";
import type { ColDef } from "ag-grid-community";
import { userService, type UserRow } from "@/services/userService";

/**
 * UsersTable
 * - demonstrates plugging the table into the users service
 */

export default function UsersTable({ user }) {
  const columnDefs = useMemo(
    () => [
      {
        headerName: "userId",
        field: "userId",
        sortable: true,
        filter: true,
        width: 110,
      },
      {
        headerName: "Name",
        field: "userName",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "userEmail",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: "Active",
        field: "Active",
        width: 110,
        valueFormatter: (p) => (p.value ? "Yes" : "No"),
      },
      { headerName: "Privileges", field: "Privileges", width: 150 },
      {
        headerName: "API Access",
        field: "apiAccess",
        width: 120,
        valueFormatter: (p) => (p.value ? "Yes" : "No"),
      },
      { headerName: "Registered", field: "registrationDate", width: 180 },
      { headerName: "Last Login", field: "lastLogin", width: 180 },
      { headerName: "Expiry", field: "ExpiryDate", width: 150 },
      { headerName: "IP", field: "ipAddress", width: 140 },
      { headerName: "Objects", field: "objectCount", width: 110 },
    ],
    []
  );

  const serverFetch = async () => ({
    data: user.objects,
    total: user.objects.length,
  });

  return (
    <div>
      <AGTable<UserRow>
        columns={columnDefs}
        fetchData={serverFetch}
        // rowIdGetter={(r) => r.userId}
        // pageSizes={[10, 20, 50, 100]}
        // initialLimit={20}
        // enableSearch={true}
        // toolbar={<div className="text-sm text-gray-600">Users</div>}
        // onRowClick={(row) => {
        //   // open detail drawer, navigate, etc.
        //   console.log("row clicked", row);
        // }}
        // className="h-[600px]"
      />
    </div>
  );
}
