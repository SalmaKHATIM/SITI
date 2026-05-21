'use client';

import { Zap, Brain } from 'lucide-react';
import { COLORS, CHART_COLORS } from '@/utils/constants';
import { aiDetectionInsightsData } from '@/utils/mock-data';

export function AIInsights() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Detection':
        return CHART_COLORS.cyan;
      case 'Anomaly':
        return CHART_COLORS.orange;
      case 'Prediction':
        return CHART_COLORS.blue;
      case 'Analysis':
        return CHART_COLORS.purple;
      case 'Correlation':
        return CHART_COLORS.pink;
      default:
        return CHART_COLORS.blue;
    }
  };

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: CHART_COLORS.blue }}>
          <Brain size={24} style={{ color: COLORS.surface }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>
          AI Detection Insights
        </h2>
      </div>

      <div className="space-y-3">
        {aiDetectionInsightsData.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg border transition-all duration-300 hover:border-opacity-100"
            style={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex items-start gap-3 mb-2">
              <Zap
                size={18}
                style={{
                  color: getCategoryColor(insight.category),
                  marginTop: '2px',
                }}
              />
              <div className="flex-1">
                <p style={{ color: COLORS.text }}>
                  {insight.insight}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{
                  backgroundColor: getCategoryColor(insight.category),
                  color: COLORS.surface,
                }}
              >
                {insight.category}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 w-32 h-1 rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${insight.confidence}%`,
                      backgroundColor: getCategoryColor(insight.category),
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: getCategoryColor(insight.category) }}
                >
                  {insight.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
