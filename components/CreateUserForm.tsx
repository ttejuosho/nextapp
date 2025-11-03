"use client";

import React, { useState } from "react";

export default function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Creating user:", form);

    // TODO: POST to backend: /api/create-user
    await fetch("http://localhost:3001/api/users", {
      method: "POST",
      body: JSON.stringify(form),
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={form.userEmail}
          onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
          required
        />
      </div>

      {/* Privileges */}
      <div>
        <label className="block text-sm font-medium mb-1">Privileges</label>
        <select
          className="w-full border rounded px-1 py-2"
          value={form.Privileges || ""}
          onChange={(e) => setForm({ ...form, Privileges: e.target.value })}
          required
        >
          <option value="" disabled>
            Select privilege
          </option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#4c6177] text-white py-2 rounded hover:bg-[#1f2e3b] cursor-pointer transition"
      >
        Create User
      </button>
    </form>
  );
}
