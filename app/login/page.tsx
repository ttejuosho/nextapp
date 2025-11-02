"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import Button from "../../components/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-700 to-slate-200 p-6">
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 text-white">
        <h1 className="text-2xl font-semibold mb-6 text-center">Log In</h1>

        <div className="space-y-4">
          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <Mail className="w-5 h-5 opacity-70" />
            <input
              type="email"
              placeholder="Email"
              className="outline-none flex-1 ml-3 placeholder-white/60"
            />
          </div>

          <div className="flex items-center border border-white/20 rounded-lg px-3 py-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="outline-none flex-1 placeholder-white/60"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="w-5 h-5 opacity-70" />
              ) : (
                <Eye className="w-5 h-5 opacity-70" />
              )}
            </button>
          </div>
          <Button label="Log In" className="w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
