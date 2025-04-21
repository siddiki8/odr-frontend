"use client";

import React from 'react';
import { CheckCircle2, XCircle, Zap, Clock, Database, BarChart, RefreshCw, GitMerge, CheckCheck, Binary, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonRow {
  benefit: string;
  customSolution: string;
  genericTool: string;
  icon: React.ReactNode;
}

const comparisonData: ComparisonRow[] = [
  {
    benefit: "Tailored Insights",
    customSolution: "Research designed for your specific needs (e.g., Equity, Legal, Market Intel) with relevant data sources and analysis",
    genericTool: "Generic web search results, often missing niche data or industry context",
    icon: <Zap className="h-5 w-5" />
  },
  {
    benefit: "Research Depth & Nuance",
    customSolution: "Multi-step process with unlimited branching and refinement opportunities(Plan→Gather→Analyze→Refine) ensures thoroughness and considers different angles",
    genericTool: "Locked into their hidden depth&nuance workflows, manual follow-up required.",
    icon: <Database className="h-5 w-5" />
  },
  {
    benefit: "Accuracy & Reliability",
    customSolution: "Structured workflows & data checks reduce errors and hallucinations",
    genericTool: "Prone to inaccuracies; requires manual fact-checking and data cleaning",
    icon: <CheckCheck className="h-5 w-5" />
  },
  {
    benefit: "Comprehensive Coverage",
    customSolution: "Automatically integrates diverse sources, including private company data (web, PDFs, APIs, databases) for a complete picture",
    genericTool: "Limited to standard web search; struggles with complex documents or specialized data",
    icon: <GitMerge className="h-5 w-5" />
  },
  {
    benefit: "Actionable Outputs",
    customSolution: "Delivers insights in usable formats: interactive dashboards, alerts, formatted reports, direct system integrations",
    genericTool: "Primarily plain text output; requires manual copying, formatting, and integration",
    icon: <BarChart className="h-5 w-5" />
  },
  {
    benefit: "Always Up-to-Date",
    customSolution: "Can continuously monitor sources and alert you to critical changes automatically",
    genericTool: "Static results; requires you to manually re-run searches to stay current",
    icon: <RefreshCw className="h-5 w-5" />
  },
  {
    benefit: "Consistent Quality",
    customSolution: "Standardized processes ensure repeatable, high-quality results every time",
    genericTool: "Output quality varies greatly depending on the prompt and the day",
    icon: <Binary className="h-5 w-5" />
  },
  {
    benefit: "Seamless Workflow Integration",
    customSolution: "Feeds insights directly into your tools (BI, CRM, Slack, etc.) via custom pipelines",
    genericTool: "Isolated tool; requires manual steps to use the research elsewhere",
    icon: <Clock className="h-5 w-5" />
  }
];

// Visual comparison diagram component
const ComparisonDiagram: React.FC = () => {
  // Icons representing sources/capabilities for ODR-API
  const odrSources = [
    { icon: <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />, name: "Databases" },
    { icon: <FileSearch className="h-5 w-5 text-blue-600 dark:text-blue-400" />, name: "Files (PDF, DOCX)" },
    { icon: <Binary className="h-5 w-5 text-blue-600 dark:text-blue-400" />, name: "APIs" },
    { icon: <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />, name: "Custom Logic" },
    { icon: <GitMerge className="h-5 w-5 text-blue-600 dark:text-blue-400" />, name: "Integrations" },
    { icon: <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />, name: "Analytics" },
  ];

  // Generic sources (simpler)
  const genericSource = { icon: <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />, name: "Web Search" };

  return (
    <div className="max-w-screen-xl mx-auto mb-16 mt-8 px-4">
      <div className="relative flex justify-between items-stretch h-[280px] md:h-[320px]">
        {/* ODR Solution side */}
        <motion.div
          className="w-[45%] bg-gradient-to-br from-green-100 to-green-50/40 dark:from-green-900/30 dark:to-green-900/10 rounded-2xl border border-green-300 dark:border-green-800 p-4 flex flex-col items-center justify-between shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="text-center font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center justify-center gap-2 text-sm md:text-base">
            <CheckCircle2 className="h-4 w-4" /> ODR-API Solution
          </h4>

          {/* Central Core */}
          <motion.div
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg flex items-center justify-center text-center p-2"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-white font-semibold text-xs md:text-sm">ODR-API Core & Agents</span>
          </motion.div>

          {/* Source Icons flowing in */}
          <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-[200px]">
            {odrSources.slice(0, 6).map((source, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-700 mb-1">
                  {source.icon}
                </div>
                {/* <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">{source.name}</p> */}
              </motion.div>
            ))}
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-auto pt-3">
            Multiple specialized agents, diverse data sources, customizable workflows
          </p>
        </motion.div>

        {/* VS indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center z-10 shadow-md"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">VS</span>
        </motion.div>

        {/* Generic Solution side */}
        <motion.div
          className="w-[45%] bg-gradient-to-br from-red-100 to-red-50/40 dark:from-red-900/30 dark:to-red-900/10 rounded-2xl border border-red-300 dark:border-red-800 p-4 flex flex-col items-center justify-between shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="text-center font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center justify-center gap-2 text-sm md:text-base">
            <XCircle className="h-4 w-4" /> Generic Solution
          </h4>

          {/* Central Core */}
          <motion.div
            className="relative w-24 h-16 md:w-28 md:h-20 rounded-lg bg-gradient-to-br from-red-400 to-orange-400 shadow-lg flex items-center justify-center text-center p-2"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-white font-semibold text-xs md:text-sm">Single LLM Interface</span>
          </motion.div>

          {/* Source Icons flowing in (simplified) */}
          <div className="flex justify-center gap-4 mt-4">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center border border-orange-200 dark:border-orange-700 mb-1">
                {genericSource.icon}
              </div>
              {/* <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">{genericSource.name}</p> */}
            </motion.div>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-auto pt-3">
            Limited capability, single interaction model, basic web search
          </p>
        </motion.div>
      </div>
      
      {/* Removed the redundant captions below the diagram */}
    </div>
  );
};

export const ComparisonTable: React.FC = () => {
  return (
    <div className="overflow-x-auto bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 border rounded-2xl shadow-xl p-6 md:p-10 relative">
      {/* subtle glow */}
      <div className="absolute -top-1/3 -left-1/4 w-2/3 h-full bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-full bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

      <motion.h3 
        className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Why Choose a Custom ODR‑API Solution?
      </motion.h3>
      
      <ComparisonDiagram />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <table className="min-w-full divide-y divide-border rounded-lg overflow-hidden">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-4 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider w-1/5">
                Benefit
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider w-2/5">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Custom ODR‑API Research Solution</span>
              </th>
              <th scope="col" className="px-4 py-4 text-left text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider w-2/5">
                <span className="inline-flex items-center gap-2"><XCircle className="h-4 w-4" /> Generic LLM Research Interface</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {comparisonData.map((row, index) => (
              <motion.tr 
                key={index} 
                className="hover:bg-muted/40 transition-colors duration-150"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <td className="px-4 py-5 whitespace-normal text-sm font-semibold text-foreground backdrop-blur">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">{row.icon}</span>
                    {row.benefit}
                  </span>
                </td>
                <td className="px-4 py-5 whitespace-normal text-sm text-foreground/90 bg-green-50 dark:bg-green-900/20">
                  <span className="inline-flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" /> {row.customSolution}</span>
                </td>
                <td className="px-4 py-5 whitespace-normal text-sm text-muted-foreground bg-red-50 dark:bg-red-900/20">
                  <span className="inline-flex items-start gap-2"><XCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" /> {row.genericTool}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      
      <motion.p 
        className="mt-10 text-center text-xl font-semibold text-primary"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        Bottom Line:
        <span className="block mt-2 text-base font-medium text-foreground">
          ODR‑API delivers powerful, reliable, and fully‑integrated research—far beyond what generic tools can offer.
        </span>
      </motion.p>
    </div>
  );
}; 