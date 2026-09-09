export interface Insight {
  _id?: string;

  end_year?: string;
  intensity?: number;
  sector?: string;
  topic?: string;
  insight?: string;
  url?: string;
  region?: string;
  start_year?: string;
  impact?: string;
  added?: string;
  published?: string;
  country?: string;
  relevance?: number;
  pestle?: string;
  source?: string;
  title?: string;
  likelihood?: number;

  city?: string;
  swot?: string;
}

export interface DashboardFilters {
  end_year?: string;
  topic?: string;
  sector?: string;
  region?: string;
  pestle?: string;
  source?: string;
  swot?: string;
  country?: string;
  city?: string;
}

export interface FilterOptions {
  end_year: string[];
  topic: string[];
  sector: string[];
  region: string[];
  pestle: string[];
  source: string[];
  swot: string[];
  country: string[];
  city: string[];
}

export interface DashboardSummary {
  total: number;
  avgIntensity: number;
  avgLikelihood: number;
  avgRelevance: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface YearData {
  year: string;
  intensity: number;
  likelihood: number;
  relevance: number;
  count: number;
}

export interface ScatterData {
  relevance: number;
  likelihood: number;
  intensity: number;
  title?: string;
  country?: string;
}

export interface DashboardAnalytics {
  summary: DashboardSummary;

  intensityByYear: YearData[];

  topics: ChartData[];

  countries: ChartData[];

  sectors: ChartData[];

  regions: ChartData[];

  pestle: ChartData[];

  sources: ChartData[];

  scatter: ScatterData[];
}