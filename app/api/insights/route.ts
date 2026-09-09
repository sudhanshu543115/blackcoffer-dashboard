import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Insight from "@/models/Insight";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100
    );

    const search = searchParams.get("search")?.trim();

    const end_year = searchParams.get("end_year");
    const topic = searchParams.get("topic");
    const sector = searchParams.get("sector");
    const region = searchParams.get("region");
    const pestle = searchParams.get("pestle");
    const source = searchParams.get("source");
    const swot = searchParams.get("swot");
    const country = searchParams.get("country");
    const city = searchParams.get("city");

    const query: Record<string, unknown> = {};

    if (end_year) {
      query.end_year = end_year;
    }

    if (topic) {
      query.topic = topic;
    }

    if (sector) {
      query.sector = sector;
    }

    if (region) {
      query.region = region;
    }

    if (pestle) {
      query.pestle = pestle;
    }

    if (source) {
      query.source = source;
    }

    if (swot) {
      query.swot = swot;
    }

    if (country) {
      query.country = country;
    }

    if (city) {
      query.city = city;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          insight: {
            $regex: search,
            $options: "i",
          },
        },
        {
          topic: {
            $regex: search,
            $options: "i",
          },
        },
        {
          country: {
            $regex: search,
            $options: "i",
          },
        },
        {
          source: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Insight.find(query)
        .sort({ published: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Insight.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Insights API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch insights",
      },
      {
        status: 500,
      }
    );
  }
}