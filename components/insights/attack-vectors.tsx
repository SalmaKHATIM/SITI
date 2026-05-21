'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { COLORS, CHART_COLORS } from '@/utils/constants';
import { topAttackVectorsData } from '@/utils/mock-data';

export function AttackVectors() {
  const getColor = (percentage: number) => {
    if (percentage >= 99) return CHART_COLORS.green;
    if (percentage >= 98) return CHART_COLORS.yellow;
    return CHART_COLORS.orange;
  };

  const chartData = topAttackVectorsData.map((item) => ({
    ...item,
    blocked_percentage: item.blocked,
  }));

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        Top Attack Vectors & Block Rate
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 150 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            type="number"
            stroke={COLORS.textSecondary}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            dataKey="vector"
            type="category"
            stroke={COLORS.textSecondary}
            style={{ fontSize: '11px' }}
            width={140}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.accent,
              borderRadius: '8px',
              color: COLORS.text,
            }}
            formatter={(value) => [(value as number).toLocaleString(), 'Count']}
          />
          <Bar
            dataKey="blocked"
            name="Blocked Attempts"
            fill={CHART_COLORS.cyan}
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        {topAttackVectorsData.map((vector) => (
          <div
            key={vector.vector}
            className="p-3 rounded-lg"
            style={{ backgroundColor: COLORS.secondary }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm" style={{ color: COLORS.text }}>
                {vector.vector}
              </h3>
              <span
                className="text-xs font-bold px-2 py-1 rounded"
                style={{
                  backgroundColor: getColor(vector.percentage),
                  color: COLORS.surface,
                }}
              >
                {vector.percentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>
              {vector.blocked} of {vector.attempts} blocked
            </p>
            <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${vector.percentage}%`,
                  backgroundColor: getColor(vector.percentage),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
