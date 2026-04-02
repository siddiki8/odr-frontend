"use client"

import React from "react"
import { AgentCard } from "@/components/landing/AgentCard"

const agentsData = [
  {
    title: "Smart Investment Dashboard Agency",
    forAudience: "Investors & Analysts",
    getBenefit:
      "A live, interactive dashboard for any stock (or your whole watchlist). Combines financials, news sentiment, analyst ratings, and alternative data in one place.",
    howItWorks: [
      { step: 1, description: "You provide: Ticker(s) or a CSV watchlist." },
      { step: 2, description: "It gathers: SEC filings, earnings calls, news, social media buzz, and alternative data feeds." },
      { step: 3, description: "It analyzes: Calculates valuations (DCF), identifies trends, spots risks, monitors key signals." },
      { step: 4, description: "You receive: Details below." },
    ],
    youReceive: [
      "An Interactive Dashboard with drill-down charts and summaries.",
      "Real-time Alerts (Slack/Email) for price moves, news, or target changes.",
      "Optional PDF/PPT reports for sharing.",
      "Data exports (Excel/CSV) or direct feeds for your own models.",
    ],
  },
  {
    title: "Real-Time Market & Competitor Pulse Agency",
    forAudience: "Product Managers, Marketing Teams, Strategy Analysts",
    getBenefit:
      "Stay ahead of the curve with continuous monitoring of your competitors and market trends.",
    howItWorks: [
      { step: 1, description: "You define: Key competitors, products, and metrics to watch." },
      { step: 2, description: "It monitors: Competitor websites, e-commerce, news feeds, and social media." },
      { step: 3, description: "It analyzes: Price changes, new features, review shifts, emerging trends." },
      { step: 4, description: "You receive: Details below." },
    ],
    youReceive: [
      "A Live Dashboard with trends, charts, and key changes highlighted.",
      "Instant Alerts when significant events happen (price drop, new feature).",
      "Regular Summary Digests (e.g., nightly email).",
      "Data ready for your BI tools.",
    ],
  },
  {
    title: "Automated Scientific Literature Review Agency",
    forAudience: "Researchers, Scientists, Medical Professionals",
    getBenefit:
      "Quickly get up to speed on a scientific topic with automated summaries, maps, and organized libraries.",
    howItWorks: [
      { step: 1, description: "You define: Your research question or topic area." },
      { step: 2, description: "It finds: Relevant papers from PubMed, ArXiv, and more." },
      { step: 3, description: "It extracts: Methods, findings, datasets, and authors from each paper." },
      { step: 4, description: "It connects: Builds a knowledge graph of concepts, papers, and researchers." },
      { step: 5, description: "You receive: Details below." },
    ],
    youReceive: [
      "A Written Summary of the literature, citing key papers.",
      "An Interactive Knowledge Map to explore connections.",
      "An Organized Bibliography (push to Zotero).",
      "Structured Data Summaries (ready for Hugging Face Datasets).",
    ],
  },
]

export default function PotentialAgentsPage() {
  return (
    <main className="bg-[var(--nd-bg)] text-[var(--nd-text-primary)] pt-14 min-h-screen">
      <div className="container mx-auto px-6 pb-16 max-w-[1200px]">
        <header className="pt-12 mb-10 border-b border-[var(--nd-border)] pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            ODR-API — POTENTIAL AGENTS
          </p>
          <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
            What You Can Build
          </h1>
          <p className="font-grotesk text-sm text-[var(--nd-text-secondary)] mt-2 max-w-xl">
            These examples illustrate the kinds of specialized research agents you can create using the ODR-API framework.
          </p>
        </header>

        <div className="space-y-6">
          {agentsData.map((agent, i) => (
            <div key={i}>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-disabled)] mb-3">
                {String(i + 1).padStart(2, "0")} —
              </p>
              <AgentCard {...agent} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
