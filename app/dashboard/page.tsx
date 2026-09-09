"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import FilterBar from "@/components/dashboard/FilterBar";
import KpiCards from "@/components/dashboard/KpiCards";
import IntensityChart from "@/components/dashboard/IntensityChart";
import TopicsChart from "@/components/dashboard/TopicsChart";
import CountryChart from "@/components/dashboard/CountryChart";
import SectorChart from "@/components/dashboard/SectorChart";
import RegionChart from "@/components/dashboard/RegionChart";
import PestleChart from "@/components/dashboard/PestleChart";
import RelevanceScatter from "@/components/dashboard/RelevanceScatter";
import DataTable from "@/components/dashboard/DataTable";

import {
  DashboardAnalytics,
  DashboardFilters,
  FilterOptions,
} from "@/types/insight";

const emptyOptions: FilterOptions = {
  end_year: [],
  topic: [],
  sector: [],
  region: [],
  pestle: [],
  source: [],
  swot: [],
  country: [],
  city: [],
};

const emptyAnalytics: DashboardAnalytics = {
  summary: {
    total: 0,
    avgIntensity: 0,
    avgLikelihood: 0,
    avgRelevance: 0,
  },
  intensityByYear: [],
  topics: [],
  countries: [],
  sectors: [],
  regions: [],
  pestle: [],
  sources: [],
  scatter: [],
};

export default function DashboardPage() {
  const [analytics, setAnalytics] =
    useState<DashboardAnalytics>(emptyAnalytics);

  const [options, setOptions] =
    useState<FilterOptions>(emptyOptions);

  const [filters, setFilters] =
    useState<DashboardFilters>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadData(
    currentFilters: DashboardFilters = {}
  ) {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams();

      Object.entries(currentFilters).forEach(
        ([key, value]) => {
          if (value) {
            query.set(key, value);
          }
        }
      );

      const analyticsUrl = query.toString()
        ? `/api/analytics?${query.toString()}`
        : "/api/analytics";

      const [analyticsResponse, filtersResponse] =
        await Promise.all([
          fetch(analyticsUrl),
          fetch("/api/filters"),
        ]);

      if (!analyticsResponse.ok || !filtersResponse.ok) {
        throw new Error("Failed to load dashboard data.");
      }

      const analyticsResult =
        await analyticsResponse.json();

      const filtersResult =
        await filtersResponse.json();

      if (!analyticsResult.success) {
        throw new Error(
          analyticsResult.message ||
            "Failed to load analytics."
        );
      }

      if (!filtersResult.success) {
        throw new Error(
          filtersResult.message ||
            "Failed to load filters."
        );
      }

      setAnalytics(analyticsResult.data);
      setOptions(filtersResult.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleFilterChange(
    key: keyof DashboardFilters,
    value: string
  ) {
    const updatedFilters = {
      ...filters,
      [key]: value || undefined,
    };

    setFilters(updatedFilters);
    loadData(updatedFilters);
  }

  function handleReset() {
    setFilters({});
    loadData({});
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <Header
        onRefresh={() => loadData(filters)}
        loading={loading}
      />

      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 sm:py-8">

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={() => loadData(filters)}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <FilterBar
          filters={filters}
          options={options}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* KPI Cards */}
        <KpiCards
          summary={analytics.summary}
          loading={loading}
        />

        {/* Charts */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IntensityChart
            data={analytics.intensityByYear}
          />

          <TopicsChart
            data={analytics.topics}
          />

          <CountryChart
            data={analytics.countries}
          />

          <SectorChart
            data={analytics.sectors}
          />

          <RegionChart
            data={analytics.regions}
          />

          <PestleChart
            data={analytics.pestle}
          />

          <div className="lg:col-span-2">
            <RelevanceScatter
              data={analytics.scatter}
            />
          </div>
        </section>

        {/* Data */}
        <DataTable filters={filters} />

        {/* Footer */}
        <footer className="border-t border-gray-200 py-6 text-center">
          <p className="text-xs text-gray-400">
           @ BUILT BY SUDHANSHU DUBEY | 2024 | BLACKCOFFER ANALYTICS
          </p>
         
        </footer>
      </div>
    </main>
  );
}