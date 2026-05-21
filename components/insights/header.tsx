'use client';

import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { COLORS } from '@/utils/constants';

interface HeaderProps {
  totalThreats: number;
  threatsChange: number;
  lastUpdated?: string;
}

export function InsightsHeader({ totalThreats, threatsChange, lastUpdated }: HeaderProps) {
  const changeColor = threatsChange > 0 ? COLORS.danger : COLORS.success;

  return (
    <div className="border-b" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
      <div className="px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Title Section */}
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.text }}>
              AI Security Insights
            </h1>
            <p className="text-lg" style={{ color: COLORS.textSecondary }}>
              Real-time threat detection and analysis powered by machine learning
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 items-center">
            {/* Total Threats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: COLORS.secondary }}>
                <AlertTriangle size={24} style={{ color: COLORS.danger }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                  Threats Detected (24h)
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold" style={{ color: COLORS.text }}>
                    {totalThreats.toLocaleString()}
                  </span>
                  <span style={{ color: changeColor }} className="text-sm font-semibold">
                    {threatsChange > 0 ? '+' : ''}{threatsChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2" style={{ color: COLORS.textSecondary }}>
              <Clock size={16} />
              <span className="text-sm">
                Last updated: {lastUpdated || new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
