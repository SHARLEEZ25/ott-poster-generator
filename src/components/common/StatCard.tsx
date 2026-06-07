// src/components/common/StatCard.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { StatCardProps } from '../../api';

export default function StatCard({ title, value, icon: Icon, gradient, trend }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group hover:border-gray-700 transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity`} />
      <div className="flex justify-between items-start relative">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center opacity-75`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}