import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/models/Insight";

export async function GET() {
  try {
    await connectDB();

    const [
      endYears,
      topics,
      sectors,
      regions,
      pestle,
      sources,
      swot,
      countries,
      cities,
    ] = await Promise.all([
      Insight.distinct("end_year"),
      Insight.distinct("topic"),
      Insight.distinct("sector"),
      Insight.distinct("region"),
      Insight.distinct("pestle"),
      Insight.distinct("source"),
      Insight.distinct("swot"),
      Insight.distinct("country"),
      Insight.distinct("city"),
    ]);

    const clean = (values: unknown[]) =>
      values
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
        .map((value) => value.trim())
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({
      success: true,
      data: {
        end_year: clean(endYears),
        topic: clean(topics),
        sector: clean(sectors),
        region: clean(regions),
        pestle: clean(pestle),
        source: clean(sources),
        swot: clean(swot),
        country: clean(countries),
        city: clean(cities),
      },
    });
  } catch (error) {
    console.error("Filter API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch filter options",
      },
      {
        status: 500,
      }
    );
  }
}