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
import { threatTypeDistribution } from '@/utils/mock-data';

const COLORS_ARRAY = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
];

export function ThreatTypesChart() {
  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        Threat Type Distribution
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={threatTypeDistribution}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            dataKey="name"
            stroke={COLORS.textSecondary}
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke={COLORS.textSecondary} style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.accent,
              borderRadius: '8px',
              color: COLORS.text,
            }}
            cursor={{ fill: COLORS.accent, opacity: 0.1 }}
            formatter={(value) => [(value as number).toLocaleString(), 'Count']}
          />
          <Bar dataKey="value" name="Threat Count" radius={[8, 8, 0, 0]}>
            {threatTypeDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS_ARRAY[index % COLORS_ARRAY.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        {threatTypeDistribution.map((threat) => (
          <div key={threat.name}>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>
              {threat.name}
            </p>
            <p className="text-sm font-bold" style={{ color: COLORS.text }}>
              {threat.value} ({threat.percentage}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
