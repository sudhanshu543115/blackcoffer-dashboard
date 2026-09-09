"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
} from "lucide-react";
import { DashboardFilters, Insight } from "@/types/insight";

interface DataTableProps {
  filters: DashboardFilters;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function DataTable({ filters }: DataTableProps) {
  const [records, setRecords] = useState<Insight[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRecords(page = 1, searchValue = search) {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "15");

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const response = await fetch(
        `/api/insights?${params.toString()}`
      );

      const result = await response.json();

      if (result.success) {
        setRecords(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Table error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSearch("");
    loadRecords(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    loadRecords(1, search);
  }

  function clearSearch() {
    setSearch("");
    loadRecords(1, "");
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Insight Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Browse the underlying intelligence data
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex w-full gap-2 md:w-auto"
        >
          <div className="relative flex-1 md:w-[300px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Search
          </button>

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="dashboard-scrollbar overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Title
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Topic
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sector
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Country
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Region
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Intensity
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Likelihood
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Relevance
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Source
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Link
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  Loading records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="max-w-[300px] px-5 py-4">
                    <p
                      className="truncate text-sm font-medium text-gray-900"
                      title={record.title}
                    >
                      {record.title || "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {record.topic || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {record.sector || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {record.country || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {record.region || "—"}
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">
                    {record.intensity ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">
                    {record.likelihood ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">
                    {record.relevance ?? 0}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {record.source || "—"}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {record.url ? (
                      <a
                        href={record.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Open source"
                      >
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {pagination.total === 0
            ? "No records"
            : `Showing ${
                (pagination.page - 1) * pagination.limit + 1
              }–${Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )} of ${pagination.total.toLocaleString()}`}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              loadRecords(pagination.page - 1)
            }
            disabled={
              !pagination.hasPreviousPage || loading
            }
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <span className="px-3 text-sm text-gray-600">
            Page {pagination.page} of{" "}
            {pagination.totalPages || 1}
          </span>

          <button
            onClick={() =>
              loadRecords(pagination.page + 1)
            }
            disabled={
              !pagination.hasNextPage || loading
            }
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}