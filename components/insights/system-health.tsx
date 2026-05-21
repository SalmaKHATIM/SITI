'use client';

import { Activity, Cpu, HardDrive, Zap, TrendingUp } from 'lucide-react';
import { COLORS, CHART_COLORS } from '@/utils/constants';
import { systemHealthData } from '@/utils/mock-data';

export function SystemHealth() {
  const getHealthColor = (value: number, threshold: number) => {
    const percentage = (value / threshold) * 100;
    if (percentage >= 80) return CHART_COLORS.red;
    if (percentage >= 60) return CHART_COLORS.orange;
    return CHART_COLORS.green;
  };

  const getIcon = (component: string) => {
    switch (component) {
      case 'CPU Usage':
        return <Cpu size={20} />;
      case 'Memory Usage':
        return <Zap size={20} />;
      case 'Disk I/O':
        return <HardDrive size={20} />;
      case 'Network Latency':
        return <Activity size={20} />;
      default:
        return <TrendingUp size={20} />;
    }
  };

  const overallHealth = Math.round(
    systemHealthData.reduce((sum, item) => sum + Math.min(100 - (item.value / item.threshold) * 100, 100), 0) /
      systemHealthData.length
  );

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.text }}>
        System Health Status
      </h2>

      {/* Overall Health Score */}
      <div
        className="rounded-lg p-4 mb-6 flex items-center justify-between"
        style={{ backgroundColor: COLORS.secondary }}
      >
        <div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Overall System Health
          </p>
          <p className="text-3xl font-bold" style={{ color: COLORS.text }}>
            {overallHealth}%
          </p>
        </div>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center border-4"
          style={{
            borderColor: overallHealth > 80 ? CHART_COLORS.green : CHART_COLORS.orange,
            backgroundColor: COLORS.border,
          }}
        >
          <span
            className="text-2xl font-bold"
            style={{
              color: overallHealth > 80 ? CHART_COLORS.green : CHART_COLORS.orange,
            }}
          >
            {overallHealth}
          </span>
        </div>
      </div>

      {/* Component Details */}
      <div className="space-y-3">
        {systemHealthData.map((item) => {
          const percentage = (item.value / item.threshold) * 100;
          const color = getHealthColor(item.value, item.threshold);
          const health = 100 - percentage;

          return (
            <div key={item.component}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded"
                    style={{ backgroundColor: COLORS.secondary }}
                  >
                    <span style={{ color }}>
                      {getIcon(item.component)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
                      {item.component}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                      {item.value.toFixed(1)} / {item.threshold.toFixed(1)}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color }}
                >
                  {health.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${health}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert if any component is critical */}
      {systemHealthData.some((item) => (item.value / item.threshold) * 100 >= 80) && (
        <div
          className="mt-6 p-3 rounded-lg border-l-4"
          style={{
            backgroundColor: COLORS.secondary,
            borderColor: CHART_COLORS.red,
          }}
        >
          <p className="text-sm" style={{ color: CHART_COLORS.red }}>
            ⚠️ Some components are approaching critical thresholds. Review immediately.
          </p>
        </div>
      )}
    </div>
  );
}
