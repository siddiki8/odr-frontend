"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Construction, Rocket, ExternalLink, FileText, Sparkles } from "lucide-react";

const reports = [
  {
    href: "https://odr.luminarysolutions.ai/reports/06da63b1-7869-4592-a0fc-0202f74da672",
    title: "Analysis of the MGM Resorts 2023 Ransomware Attack",
  },
  {
    href: "https://odr.luminarysolutions.ai/reports/0934a5d6-c67a-439c-b0f4-a3938973d825",
    title: "Analysis of the $OM Token",
  },
  {
    href: "https://odr.luminarysolutions.ai/reports/8c02146c-ba60-4f85-ad85-a2a27ddf5a59",
    title: "Latest Advancements in Quantum Computing",
  },
];

function DemoContent() {
  const searchParams = useSearchParams();
  const showLiveDemo =
    searchParams.get("live") === "1" || process.env.NEXT_PUBLIC_SHOW_DEMO_LINK === "true";

  return (
    <section className="relative min-h-[80vh] pt-28 pb-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950">
      {/* Background Glows */}
      <div className="absolute -top-1/3 left-0 w-1/2 h-full bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute -bottom-1/3 right-0 w-1/2 h-full bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 border border-blue-200 dark:border-blue-800">
            <Construction className="h-4 w-4" /> Under Construction
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400">
            New Research Agent Interfaces In Progress
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            We’re building polished, specialized interfaces for multiple research agencies powered by
            the ODR-API. In the meantime, explore completed reports and our framework.
          </p>

          {/* CTA Row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {showLiveDemo && (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all rounded-xl">
                <Link href="/deep_research">
                  <Rocket className="mr-2 h-5 w-5" /> Launch Current Demo
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="border-gray-300 dark:border-gray-600">
              <Link href="/potential-agents">
                <Sparkles className="mr-2 h-5 w-5" /> View Potential Agents
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-300 dark:border-gray-600">
              <Link href="/comparison">Compare Solutions</Link>
            </Button>
          </div>
        </div>

        {/* Featured Reports */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Featured Completed Reports
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Explore some completed deep-research deliverables created using the ODR-API.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm font-medium mb-3">
                    <FileText className="h-4 w-4" /> Completed Report
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                    {r.title}
                  </h3>
                  <div className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                    View Report <ExternalLink className="ml-1.5 h-4 w-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <section className="relative min-h-[60vh] pt-28 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-5 w-40 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-9 w-2/3 mx-auto mb-3 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-5 w-1/2 mx-auto mb-10 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0,1,2].map((i) => (
                  <div key={i} className="h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-gray-900/40 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </section>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
