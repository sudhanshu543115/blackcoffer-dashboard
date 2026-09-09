import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/models/Insight";

function buildMatch(searchParams: URLSearchParams) {
  const match: Record<string, unknown> = {};

  const filters = [
    "end_year",
    "topic",
    "sector",
    "region",
    "pestle",
    "source",
    "swot",
    "country",
    "city",
  ];

  for (const filter of filters) {
    const value = searchParams.get(filter);

    if (value && value.trim()) {
      match[filter] = value.trim();
    }
  }

  return match;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const match = buildMatch(searchParams);

    /*
     * Run all MongoDB aggregations in parallel.
     * This gives us the data required by the dashboard.
     */
    const [
      summaryResult,
      intensityByYear,
      topics,
      countries,
      sectors,
      regions,
      pestle,
      sources,
      scatter,
    ] = await Promise.all([
      // -----------------------------------------
      // SUMMARY / KPI DATA
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgIntensity: {
              $avg: {
                $ifNull: ["$intensity", 0],
              },
            },
            avgLikelihood: {
              $avg: {
                $ifNull: ["$likelihood", 0],
              },
            },
            avgRelevance: {
              $avg: {
                $ifNull: ["$relevance", 0],
              },
            },
          },
        },
      ]),

      // -----------------------------------------
      // INTENSITY / LIKELIHOOD / RELEVANCE BY YEAR
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $project: {
            year: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$start_year", ""] },
                    { $ne: ["$start_year", null] },
                  ],
                },
                "$start_year",
                "$end_year",
              ],
            },

            intensity: {
              $ifNull: ["$intensity", 0],
            },

            likelihood: {
              $ifNull: ["$likelihood", 0],
            },

            relevance: {
              $ifNull: ["$relevance", 0],
            },
          },
        },

        {
          $match: {
            year: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$year",

            intensity: {
              $avg: "$intensity",
            },

            likelihood: {
              $avg: "$likelihood",
            },

            relevance: {
              $avg: "$relevance",
            },

            count: {
              $sum: 1,
            },
          },
        },

        {
          $project: {
            _id: 0,
            year: "$_id",
            intensity: { $round: ["$intensity", 2] },
            likelihood: { $round: ["$likelihood", 2] },
            relevance: { $round: ["$relevance", 2] },
            count: 1,
          },
        },

        {
          $sort: {
            year: 1,
          },
        },
      ]),

      // -----------------------------------------
      // TOPICS
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $match: {
            topic: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$topic",
            value: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },

        {
          $sort: {
            value: -1,
          },
        },

        {
          $limit: 15,
        },
      ]),

      // -----------------------------------------
      // COUNTRIES
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $match: {
            country: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$country",
            value: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },

        {
          $sort: {
            value: -1,
          },
        },

        {
          $limit: 15,
        },
      ]),

      // -----------------------------------------
      // SECTORS
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $match: {
            sector: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$sector",
            value: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },

        {
          $sort: {
            value: -1,
          },
        },
      ]),

      // -----------------------------------------
      // REGIONS
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $match: {
            region: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$region",
            value: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },

        {
          $sort: {
            value: -1,
          },
        },

        {
          $limit: 15,
        },
      ]),

      // -----------------------------------------
      // PESTLE
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $match: {
            pestle: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$pestle",
            value: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },

        {
          $sort: {
            value: -1,
          },
        },
      ]),

      // -----------------------------------------
      // SOURCES
      // -----------------------------------------
      Insight.aggregate([
        { $match: match },

        {
          $match: {
            source: {
              $nin: ["", null],
            },
          },
        },

        {
          $group: {
            _id: "$source",
            value: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },

        {
          $sort: {
            value: -1,
          },
        },

        {
          $limit: 15,
        },
      ]),

      // -----------------------------------------
      // LIKELIHOOD × RELEVANCE
      // -----------------------------------------
      Insight.aggregate([
        {
          $match: {
            ...match,
            likelihood: {
              $gt: 0,
            },
            relevance: {
              $gt: 0,
            },
          },
        },

        {
          $project: {
            _id: 0,

            relevance: 1,

            likelihood: 1,

            intensity: {
              $ifNull: ["$intensity", 0],
            },

            title: 1,

            country: 1,
          },
        },

        {
          $limit: 500,
        },
      ]),
    ]);

    const summary = summaryResult[0] || {
      total: 0,
      avgIntensity: 0,
      avgLikelihood: 0,
      avgRelevance: 0,
    };

    return NextResponse.json({
      success: true,

      data: {
        summary: {
          total: summary.total || 0,

          avgIntensity: Number(
            (summary.avgIntensity || 0).toFixed(2)
          ),

          avgLikelihood: Number(
            (summary.avgLikelihood || 0).toFixed(2)
          ),

          avgRelevance: Number(
            (summary.avgRelevance || 0).toFixed(2)
          ),
        },

        intensityByYear,

        topics,

        countries,

        sectors,

        regions,

        pestle,

        sources,

        scatter,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics data",
      },
      {
        status: 500,
      }
    );
  }
}