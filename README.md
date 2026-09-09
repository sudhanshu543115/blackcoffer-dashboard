# Blackcoffer Analytics Dashboard

An interactive data visualization dashboard built for the Blackcoffer Software Engineer (Full-stack) Associate take-home assignment.

The application uses the provided JSON dataset, stores the data in MongoDB, exposes analytics through Next.js API routes, and presents the results through an interactive responsive dashboard.

---

## Overview

The dashboard provides an analytical view of the supplied intelligence data across multiple dimensions including:

- Intensity
- Likelihood
- Relevance
- Year
- Country
- Topics
- Sector
- Region
- PESTLE
- Source
- SWOT
- City

Users can apply multiple filters simultaneously, explore visual trends, search individual records, and navigate through the underlying dataset.

---

## Features

### Dashboard Analytics

The dashboard includes:

- Total Records KPI
- Average Intensity
- Average Likelihood
- Average Relevance
- Intensity, Likelihood and Relevance trend by year
- Top Topics
- Top Countries
- Insights by Sector
- Insights by Region
- PESTLE distribution
- Likelihood vs Relevance scatter plot

### Interactive Filters

The following filters are available:

- End Year
- Topic
- Sector
- Region
- PESTLE
- Source
- Country
- City
- SWOT

Filters dynamically update the dashboard analytics and data table.

### Insight Data Table

The dashboard also provides access to the underlying records with:

- Search functionality
- Pagination
- Applied filter support
- Intensity, likelihood and relevance values
- Source information
- Links to original source URLs

### Other Features

- Responsive design
- Loading states
- Error handling
- Refresh functionality
- Reset filters functionality
- MongoDB-backed data
- Production-ready Next.js build

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- Next.js App Router API Routes
- Node.js
- MongoDB
- Mongoose

### Data

- Provided `jsondata.json` dataset

---

## Project Structure

```text
blackcoffer-dashboard/
│
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   │   └── route.ts
│   │   ├── filters/
│   │   │   └── route.ts
│   │   └── insights/
│   │       └── route.ts
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── dashboard/
│       ├── Header.tsx
│       ├── FilterBar.tsx
│       ├── KpiCards.tsx
│       ├── IntensityChart.tsx
│       ├── TopicsChart.tsx
│       ├── CountryChart.tsx
│       ├── SectorChart.tsx
│       ├── RegionChart.tsx
│       ├── PestleChart.tsx
│       ├── RelevanceScatter.tsx
│       └── DataTable.tsx
│
├── lib/
│   └── mongodb.ts
│
├── models/
│   └── Insight.ts
│
├── scripts/
│   └── import-data.ts
│
├── types/
│   └── insight.ts
│
├── jsondata.json
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md