'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '@/utils/constants';
import { severityDistribution } from '@/utils/mock-data';

export function SeverityDistribution() {
  const total = severityDistribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        Severity Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={severityDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {severityDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.accent,
              borderRadius: '8px',
              color: COLORS.text,
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Count']}
          />
          <Legend wrapperStyle={{ color: COLORS.text }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        {severityDistribution.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                {item.name}
              </p>
              <p className="text-sm font-bold" style={{ color: COLORS.text }}>
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
