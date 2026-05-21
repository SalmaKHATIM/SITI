'use client';

import { COLORS } from '@/utils/constants';
import { threatHeatmapData } from '@/utils/mock-data';

export function ThreatHeatmap() {
  const getSeverityColor = (severity: number) => {
    const colors = ['#166534', '#22c55e', '#eab308', '#f97316', '#ef4444'];
    return colors[severity] || colors[0];
  };

  const maxCount = Math.max(...threatHeatmapData.map((d) => d.count));

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        Threat Severity Heatmap (24h)
      </h2>

      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-4">
          {threatHeatmapData.map((data) => (
            <div
              key={data.time}
              className="flex flex-col items-center gap-2"
              style={{ minWidth: '40px' }}
            >
              {/* Heatmap bars */}
              <div className="w-6 h-32 rounded-t-lg" style={{
                backgroundColor: getSeverityColor(data.severity),
                opacity: Math.min(1, (data.count / maxCount) * 1.2),
                transition: 'all 0.3s ease',
              }} 
              title={`${data.time}: ${data.count} threats (severity: ${data.severity})`}
              />
              {/* Time labels */}
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                {data.time.split(':')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        <p className="text-sm font-semibold mb-3" style={{ color: COLORS.text }}>
          Severity Levels
        </p>
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: getSeverityColor(level) }}
              />
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>
                {['Low', 'Medium', 'High', 'Critical', 'Extreme'][level]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
