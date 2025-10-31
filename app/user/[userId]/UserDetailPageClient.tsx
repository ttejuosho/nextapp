"use client";

import React, { useMemo } from "react";
import DataTable from "@/components/DataTable";
import AGTable from "@/components/AGTable";
import type { ColDef } from "ag-grid-community";
import { Signal, SignalLow } from "lucide-react";

type ObjectRow = {
  objectId: string;
  name: string;
  IMEI: string;
  active: boolean;
  expiryDate: string;
  lastConnection: string;
  status: boolean;
};

function Info({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-gray-500 text-xs uppercase tracking-wide">
        {label}
      </div>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );
}

export default function UserDetailPageClient({ user }) {
  const objectColumns = useMemo(
    () => [
      { headerName: "Name", field: "name", width: 200 },
      { headerName: "IMEI", field: "IMEI", width: 160 },
      {
        field: "Active",
        headerName: "Active",
        width: 100,
        cellRenderer: ({ value }) => (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 8,
              backgroundColor: value ? "#fee2e2" : "#dcfce7",
              color: value ? "#991b1b" : "#166534",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {value ? "Inactive" : "Active"}
          </span>
        ),
      },
      { headerName: "Expiry", field: "expiryDate", width: 120 },
      { headerName: "Last Connection", field: "lastConnection", width: 200 },
      {
        field: "Status",
        headerName: "Status",
        flex: 1,
        cellRenderer: (params: any) => {
          const isActive = params.value == true;
          const Icon = isActive ? SignalLow : Signal;
          return (
            <Icon
              size={18}
              color={isActive ? "#ef4444" : "#22c55e"}
              style={{ marginLeft: "8px" }}
            />
          );
        },
      },
    ],
    []
  );

  const serverFetch = async () => ({
    data: user.objects,
    total: user.objects.length,
  });

  return (
    // UserDetailPageClient.tsx (only replacing the top card section)

    <div className="p-6 space-y-6">
      {/* User Info Card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-[#28394b]">
            {user.userName}
          </h1>
          <p className="text-sm text-gray-500">User ID: {user.userId}</p>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-3 mb-3">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              user.Active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.Active ? "Active" : "Inactive"}
          </span>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              user.apiAccess
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            API Access: {user.apiAccess ? "Enabled" : "Disabled"}
          </span>

          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            Objects: {user.objectCount}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
          <Info label="Email" value={user.userEmail} />
          <Info label="Privileges" value={user.Privileges} />
          <Info label="Registered" value={user.registrationDate} />
          <Info label="Last Login" value={user.lastLogin} />
          <Info label="Expiry Date" value={user.ExpiryDate} />
          <Info label="IP Address" value={user.ipAddress} />

          <Info label="API Alerts" value={user.API ? "Enabled" : "Disabled"} />
          <Info
            label="Email Alerts"
            value={user.Email ? "Enabled" : "Disabled"}
          />
          <Info label="SMS Alerts" value={user.Sms ? "Enabled" : "Disabled"} />
          <Info
            label="Webhook Alerts"
            value={user.Webhook ? "Enabled" : "Disabled"}
          />
        </div>
      </div>

      {/* Objects Table */}
      <AGTable<ObjectRow> columns={objectColumns} fetchData={serverFetch} />
    </div>
  );
}
