import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  bgColor?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  bgColor = "bg-primary/10"
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </p>
        </div>
        <div
          className={`${bgColor} dark:bg-opacity-20 p-2.5 rounded-lg flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
