"use client";

import React from 'react';
import Image from 'next/image';
import { AgentCard } from '@/components/landing/AgentCard';
import { BarChart2, Activity, Microscope, ArrowRight, Database, FileSearch, BarChart, PieChart, FileCog, MessageSquare, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const agentsData = [
  {
    title: "Smart Investment Dashboard Agency",
    forAudience: "Investors & Analysts",
    getBenefit: "A live, interactive dashboard for any stock (or your whole watchlist). Combines financials, news sentiment, analyst ratings, and alternative data in one place.",
    howItWorks: [
      { step: 1, description: "You provide: Ticker(s) or a CSV watchlist." },
      { step: 2, description: "It gathers: SEC filings, earnings calls, news, social media buzz, and unique alternative data feeds." },
      { step: 3, description: "It analyzes: Calculates valuations (like DCF), identifies trends, spots risks, and monitors key signals." },
      { step: 4, description: "You receive: Details below." }
    ],
    youReceive: [
      "An Interactive Dashboard with drill-down charts and summaries (Business Model, Financials, Valuation, Risks, etc.).",
      "Real-time Alerts (via Slack/Email) for important price moves, news, or target changes.",
      "Optional PDF/PPT reports for sharing.",
      "Data exports (like Excel/CSV) or direct feeds for your own models."
    ],
    icon: <BarChart2 className="h-10 w-10" />,
  },
  {
    title: "Real-Time Market & Competitor Pulse Agency",
    forAudience: "Product Managers, Marketing Teams, Strategy Analysts",
    getBenefit: "Stay ahead of the curve with continuous monitoring of your competitors and market trends.",
    howItWorks: [
      { step: 1, description: "You define: Your key competitors, products, and metrics to watch." },
      { step: 2, description: "It monitors: Regularly checks competitor websites, e-commerce sites, news feeds, and social media." },
      { step: 3, description: "It analyzes: Detects price changes, new feature announcements, shifts in customer reviews, and emerging trends." },
      { step: 4, description: "You receive: Details below." }
    ],
    youReceive: [
      "A Live Dashboard with trends, charts, and key changes highlighted.",
      "Instant Alerts (e.g., via Slack) when significant events happen (like a price drop).",
      "Regular Summary Digests (e.g., nightly email).",
      "Data ready for your Business Intelligence (BI) tools."
    ],
    icon: <Activity className="h-10 w-10" />,
  },
  {
    title: "Automated Scientific Literature Review Agency",
    forAudience: "Researchers, Scientists, Medical Professionals",
    getBenefit: "Quickly get up to speed on a scientific topic with automated summaries, maps, and organized libraries.",
    howItWorks: [
      { step: 1, description: "You define: Your research question or topic area." },
      { step: 2, description: "It finds: Relevant papers from databases like PubMed, ArXiv, etc." },
      { step: 3, description: "It extracts: Key information like methods, findings, datasets, and authors from each paper." },
      { step: 4, description: "It connects: Builds a visual 'knowledge graph' showing how concepts, papers, and researchers relate." },
      { step: 5, description: "You receive: Details below." }
    ],
    youReceive: [
      "A Written Summary of the literature, citing key papers.",
      "An Interactive Knowledge Map to explore connections.",
      "An Organized Bibliography (e.g., push to Zotero).",
      "Structured Data Summaries (e.g., ready for Hugging Face Datasets)."
    ],
    icon: <Microscope className="h-10 w-10" />,
  },
];

// Flow diagrams for each agent type
const WorkflowDiagram = ({ steps, agentIndex }) => {
  const colors = [
    { bg: 'from-blue-500 to-cyan-500', text: 'text-white' },
    { bg: 'from-purple-500 to-pink-500', text: 'text-white' },
    { bg: 'from-emerald-500 to-teal-500', text: 'text-white' },
  ];
  
  const { bg, text } = colors[agentIndex % colors.length];

  return (
    <div className="w-full py-6 px-2">
      <div className="flex justify-between items-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.div 
              className={`flex flex-col items-center`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg ${text}`}>
                {step.icon}
              </div>
              <p className="text-xs md:text-sm mt-2 text-center font-medium max-w-[100px]">{step.name}</p>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div 
                className="flex-1 mx-1 md:mx-2"
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
                viewport={{ once: true }}
              >
                <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 relative h-0 top-8 md:top-10">
                  <ArrowRight className="absolute -right-2 -top-3.5 text-gray-400 dark:text-gray-500" />
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default function PotentialAgentsPage() {
  // Workflow steps for each agent
  const workflowData = [
    [
      { name: "Data Collection", icon: <Database className="h-6 w-6" /> },
      { name: "Financial Analysis", icon: <BarChart className="h-6 w-6" /> },
      { name: "Risk Assessment", icon: <PieChart className="h-6 w-6" /> },
      { name: "Dashboard Generation", icon: <BarChart2 className="h-6 w-6" /> }
    ],
    [
      { name: "Define Targets", icon: <FileSearch className="h-6 w-6" /> },
      { name: "Monitor Changes", icon: <Activity className="h-6 w-6" /> },
      { name: "Analyze Trends", icon: <FileCog className="h-6 w-6" /> },
      { name: "Alert & Report", icon: <MessageSquare className="h-6 w-6" /> }
    ],
    [
      { name: "Query Definition", icon: <FileSearch className="h-6 w-6" /> },
      { name: "Literature Search", icon: <Database className="h-6 w-6" /> },
      { name: "Information Extraction", icon: <FileCog className="h-6 w-6" /> },
      { name: "Knowledge Mapping", icon: <Zap className="h-6 w-6" /> }
    ]
  ];

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-1/4 left-0 w-1/2 h-full bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-1/4 right-0 w-1/2 h-full bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Potential Agent Examples
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Build powerful, specialized agents for your specific needs using the ODR-API framework.
            These examples illustrate what's possible.
          </motion.p>
        </div>

        {/* Main illustration */}
        <div className="w-full max-w-4xl mx-auto mb-20 relative">
          <motion.div
            className="aspect-[16/9] relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 backdrop-blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl p-4">
                {[BarChart2, Activity, Microscope].map((Icon, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg flex flex-col items-center text-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium">{["Finance", "Market", "Research"][idx]} Agent</span>
                  </motion.div>
                ))}
              </div>
              <div className="absolute top-1/4 left-0 right-0 flex justify-center">
                <div className="bg-blue-600/80 dark:bg-blue-500/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                  ODR-API Framework
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-blue-600/70 dark:bg-blue-400/70"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cards and workflow diagrams */}
        <div className="space-y-24 md:space-y-32 max-w-7xl mx-auto">
          {agentsData.map((agent, index) => (
            <div key={index} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <AgentCard
                  title={agent.title}
                  forAudience={agent.forAudience}
                  getBenefit={agent.getBenefit}
                  howItWorks={agent.howItWorks}
                  youReceive={agent.youReceive}
                  icon={agent.icon}
                />
              </motion.div>

              <div className="mt-8">
                <h4 className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  How It Works
                </h4>
                <WorkflowDiagram steps={workflowData[index]} agentIndex={index} />
              </div>
              
              {/* Mockup visualization */}
              <motion.div 
                className="max-w-3xl mx-auto bg-white dark:bg-gray-800/80 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="h-6 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 aspect-video relative">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {index === 0 && "Stock Dashboard Visualization"}
                      {index === 1 && "Market Intelligence Dashboard"}
                      {index === 2 && "Research Knowledge Graph"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 