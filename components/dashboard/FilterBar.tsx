"use client";

import { RotateCcw } from "lucide-react";
import { DashboardFilters, FilterOptions } from "@/types/insight";

interface FilterBarProps {
  filters: DashboardFilters;
  options: FilterOptions;
  onChange: (
    key: keyof DashboardFilters,
    value: string
  ) => void;
  onReset: () => void;
}

const filterConfig: {
  key: keyof DashboardFilters;
  label: string;
}[] = [
  { key: "end_year", label: "End Year" },
  { key: "topic", label: "Topic" },
  { key: "sector", label: "Sector" },
  { key: "region", label: "Region" },
  { key: "pestle", label: "PESTLE" },
  { key: "source", label: "Source" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "swot", label: "SWOT" },
];

export default function FilterBar({
  filters,
  options,
  onChange,
  onReset,
}: FilterBarProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Dashboard Filters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Filter insights to explore specific trends
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {filterConfig.map(({ key, label }) => (
          <div key={key}>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {label}
            </label>

            <select
              value={filters[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="">All</option>

              {options[key].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}