import {
  Activity,
  BarChart3,
  Database,
  Target,
} from "lucide-react";
import { DashboardSummary } from "@/types/insight";

interface KpiCardsProps {
  summary: DashboardSummary;
  loading?: boolean;
}

export default function KpiCards({
  summary,
  loading = false,
}: KpiCardsProps) {
  const cards = [
    {
      title: "Total Records",
      value: summary.total.toLocaleString(),
      description: "Insights in current view",
      icon: Database,
    },
    {
      title: "Avg. Intensity",
      value: summary.avgIntensity.toFixed(2),
      description: "Average intensity score",
      icon: Activity,
    },
    {
      title: "Avg. Likelihood",
      value: summary.avgLikelihood.toFixed(2),
      description: "Average likelihood score",
      icon: Target,
    },
    {
      title: "Avg. Relevance",
      value: summary.avgRelevance.toFixed(2),
      description: "Average relevance score",
      icon: BarChart3,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  {loading ? "—" : card.value}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
                <Icon size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}