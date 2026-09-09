"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ScatterData } from "@/types/insight";

interface RelevanceScatterProps {
  data: ScatterData[];
}

export default function RelevanceScatter({
  data,
}: RelevanceScatterProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          Likelihood vs Relevance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Relationship between likelihood and relevance scores
        </p>
      </div>

      <div className="h-[350px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">
              No correlation data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 10,
                right: 20,
                bottom: 20,
                left: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                dataKey="relevance"
                name="Relevance"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Relevance",
                  position: "insideBottom",
                  offset: -10,
                }}
              />

              <YAxis
                type="number"
                dataKey="likelihood"
                name="Likelihood"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Likelihood",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value, name) => [
                  Number(value).toFixed(2),
                  name,
                ]}
              />

              <Scatter
                name="Insights"
                data={data}
                fill="#111827"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}