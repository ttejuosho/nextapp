"use client";

import React, { useMemo } from "react";
import AGTable from "@/components/AGTable";
import { useRouter } from "next/navigation";
import { Signal, SignalLow } from "lucide-react";

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  Active: boolean;
  ExpiryDate: string;
  Privileges: string;
  apiAccess: boolean;
  registrationDate: string;
  lastLogin: string;
  ipAddress: string;
  subAccounts: number;
  objectCount: number;
  Email: number;
  Sms: number;
  Webhook: number;
  API: number;
}

export default function HomePage() {
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        field: "userName",
        headerName: "Username",
        cellRenderer: (params: any) => (
          <a
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#28394b",
            }}
            onClick={() => router.push(`/user/${params.data.userId}`)}
          >
            {params.value}
          </a>
        ),
      },
      { field: "userEmail", headerName: "Email" },
      {
        field: "Active",
        headerName: "Active",
        cellRenderer: ({ value }) => (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 8,
              backgroundColor: value ? "#dcfce7" : "#fee2e2",
              color: value ? "#166534" : "#991b1b",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      { field: "objectCount", headerName: "Objects" },
      { field: "ExpiryDate", headerName: "Expiry Date" },
      { field: "Privileges", headerName: "Privileges" },
      { field: "registrationDate", headerName: "Registered On" },
      { field: "lastLogin", headerName: "Last Login" },
      { field: "ipAddress", headerName: "IP Address" },
      { field: "apiAccess", headerName: "API Access" },
      { field: "subAccounts", headerName: "Sub-Accounts" },
      { field: "Email", headerName: "Email Alerts" },
      { field: "Sms", headerName: "SMS Alerts" },
      { field: "Webhook", headerName: "Webhook Alerts" },
      { field: "API", headerName: "API Alerts" },
    ],
    [router]
  );

  const fetchUsers = async ({ page, pageSize, search }: any) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
    params.append("search", search || "");

    const res = await fetch(
      `http://localhost:3001/api/users?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const json = await res.json();
    return { data: json.data, total: json.total };
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <AGTable<User>
        columns={columns}
        fetchData={fetchUsers}
        searchEnabled={true}
        pageSize={50}
      />
    </div>
  );
}
