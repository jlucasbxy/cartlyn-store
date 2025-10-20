import { ReactNode } from 'react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    bgColor?: string;
}

export function StatsCard({ label, value, icon, bgColor = 'bg-indigo-100' }: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`${bgColor} dark:bg-opacity-20 p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
