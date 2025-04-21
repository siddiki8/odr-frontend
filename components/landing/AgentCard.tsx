import React from 'react';

interface AgentCardProps {
  title: string;
  forAudience: string;
  getBenefit: string;
  howItWorks: { step: number; description: string }[];
  youReceive: string[];
  icon?: React.ReactNode;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  title,
  forAudience,
  getBenefit,
  howItWorks,
  youReceive,
  icon,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white via-blue-50/40 to-white dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 p-8 backdrop-blur">
      {/* Glow background */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-400/10 dark:bg-cyan-600/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-400/10 dark:bg-blue-600/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {icon && <div className="mb-4 text-blue-600 dark:text-cyan-400">{icon}</div>}
        <h3 className="text-2xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400">
          {title}
        </h3>
        <p className="mb-2 text-sm md:text-base">
          <strong className="font-semibold">For:</strong> {forAudience}
        </p>
        <p className="mb-6 text-sm md:text-base">
          <strong className="font-semibold">Get:</strong> {getBenefit}
        </p>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-primary/90">How it Works:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {howItWorks.map((item) => (
              <li key={item.step}>
                <span className="font-medium">{item.description.split(":")[0]}:</span>
                {item.description.substring(item.description.indexOf(":") + 1)}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2 text-primary/90">You receive:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {youReceive.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 