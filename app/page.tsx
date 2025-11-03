// Home page displaying a table of users with pagination and search functionality
"use client";

import React, { useMemo, useState } from "react";
import AGTable from "@/components/AGTable";
import { useRouter } from "next/navigation";
import { Signal, SignalLow } from "lucide-react";
import { Mail, UserPlus } from "lucide-react";
import Modal from "@/components/Modal";
import CreateUserForm from "@/components/CreateUserForm";

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
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const handleSendEmail = () => {
    const emails = selectedUsers.map((u) => u.userEmail);
    console.log("Send email to:", emails);
  };

  const handleSendUserEmail = (rows?: any[]) => {
    // If a row was passed in, use it.
    // Otherwise, use selected rows from grid.
    const selected = rows ?? gridRef.current?.getSelectedRows?.() ?? [];
    console.log("Selected rows: ", selected);
    // TODO: call backend API to send emails
  };

  const columns = useMemo(
    () => [
      {
        field: "__options",
        headerName: "",
        width: 60,
        cellRenderer: (params: any) => (
          <Mail
            className="w-4 h-4 text-blue-300 hover:text-blue-500 cursor-pointer"
            onClick={() => handleSendUserEmail([params.data.userEmail])}
          />
        ),
        //suppressMenu: true,
        sortable: false,
        filter: false,
        pinned: "left",
      },
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

      <div className="flex items-center justify-between mb-3">
        <div></div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenCreateUser(true)}
            className="p-2 rounded-md bg-[#4c6177] text-white hover:bg-[#1f2e3b] cursor-pointer transition"
          >
            <UserPlus className="w-7 h-7" />
          </button>

          <button
            onClick={() => handleSendEmail()}
            disabled={selectedUsers.length === 0}
            className={`p-2 rounded-md text-white transition ${
              selectedUsers.length === 0
                ? "text-gray-400 bg-gray-400 cursor-not-allowed"
                : "text-black-600 bg-[#1f2e3b] hover:bg-[#1f2e3b] cursor-pointer"
            }`}
            title={
              selectedUsers.length === 0
                ? "Select at least one row to send email"
                : `Send email to ${selectedUsers.length} selected user(s)`
            }
          >
            <Mail className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* ✅ Create User Modal */}
      <Modal
        open={openCreateUser}
        onClose={() => setOpenCreateUser(false)}
        title="Add User"
      >
        <CreateUserForm onClose={() => setOpenCreateUser(false)} />
      </Modal>

      <AGTable<User>
        columns={columns}
        fetchData={fetchUsers}
        searchEnabled={true}
        onSelectionChange={setSelectedUsers}
        pageSize={50}
      />
    </div>
  );
}
