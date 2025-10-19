import { ReactNode } from 'react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    bgColor?: string;
}

export function StatsCard({ label, value, icon, bgColor = 'bg-indigo-100' }: StatsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${bgColor} p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
