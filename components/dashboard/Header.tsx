"use client";

import { BarChart3, RefreshCw } from "lucide-react";

interface HeaderProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export default function Header({
  onRefresh,
  loading = false,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
            <BarChart3 size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Blackcoffer Analytics
            </h1>
            <p className="text-sm text-gray-500">
              Global intelligence dashboard
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>
    </header>
  );
}