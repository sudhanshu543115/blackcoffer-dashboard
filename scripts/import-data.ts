// import dotenv from "dotenv";

// dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import Insight from "../models/Insight";

async function importData() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("Connected to MongoDB.");

    const filePath = path.join(process.cwd(), "jsondata.json");

    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON file not found: ${filePath}`);
    }

    console.log("Reading JSON file...");

    const fileContent = fs.readFileSync(filePath, "utf-8");

    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      throw new Error(
        "jsondata.json must contain an array of objects."
      );
    }

    console.log(`Found ${data.length} records.`);

    console.log("Clearing existing collection...");

    await Insight.deleteMany({});

    console.log("Existing data cleared.");

    const cleanedData = data.map((item) => ({
      end_year: item.end_year || "",
      intensity: Number(item.intensity) || 0,
      sector: item.sector || "",
      topic: item.topic || "",
      insight: item.insight || "",
      url: item.url || "",
      region: item.region || "",
      start_year: item.start_year || "",
      impact: item.impact || "",
      added: item.added || "",
      published: item.published || "",
      country: item.country || "",
      relevance: Number(item.relevance) || 0,
      pestle: item.pestle || "",
      source: item.source || "",
      title: item.title || "",
      likelihood: Number(item.likelihood) || 0,
      city: item.city || "",
      swot: item.swot || "",
    }));

    console.log("Inserting records...");

    await Insight.insertMany(cleanedData);

    console.log(
      `Successfully imported ${cleanedData.length} records.`
    );

    const count = await Insight.countDocuments();

    console.log(`MongoDB now contains ${count} records.`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
    console.log("Import completed successfully.");
  } catch (error) {
    console.error("Import failed:");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
}

importData();