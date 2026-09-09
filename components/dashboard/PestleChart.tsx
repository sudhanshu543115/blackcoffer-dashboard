"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartData } from "@/types/insight";

interface PestleChartProps {
  data: ChartData[];
}

export default function PestleChart({ data }: PestleChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          PESTLE Analysis
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Insights grouped by PESTLE category
        </p>
      </div>

      <div className="h-[350px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">
              No PESTLE data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={115}
                innerRadius={55}
                paddingAngle={2}
                label={({ name, percent }) =>
  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={
                      [
                        "#111827",
                        "#374151",
                        "#4b5563",
                        "#6b7280",
                        "#9ca3af",
                        "#d1d5db",
                      ][index % 6]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}