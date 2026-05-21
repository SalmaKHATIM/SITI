'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { COLORS, CHART_COLORS } from '@/utils/constants';
import { hourlyThreatsData } from '@/utils/mock-data';

export function ThreatsChart() {
  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        24-Hour Threat Detection Timeline
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={hourlyThreatsData}>
          <defs>
            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.8} />
              <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.cyan} stopOpacity={0.8} />
              <stop offset="95%" stopColor={CHART_COLORS.cyan} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.orange} stopOpacity={0.6} />
              <stop offset="95%" stopColor={CHART_COLORS.orange} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            dataKey="hour"
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
            cursor={{ stroke: COLORS.accent, strokeWidth: 2 }}
          />
          <Legend wrapperStyle={{ color: COLORS.text }} />
          <Area
            type="monotone"
            dataKey="threats"
            stroke={CHART_COLORS.red}
            fillOpacity={1}
            fill="url(#colorThreats)"
            name="Total Threats"
          />
          <Area
            type="monotone"
            dataKey="ai_detected"
            stroke={CHART_COLORS.cyan}
            fillOpacity={1}
            fill="url(#colorAI)"
            name="AI Detected"
          />
          <Area
            type="monotone"
            dataKey="anomalies"
            stroke={CHART_COLORS.orange}
            fillOpacity={1}
            fill="url(#colorAnomalies)"
            name="Anomalies"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        <div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Peak Hour
          </p>
          <p className="text-lg font-bold" style={{ color: COLORS.text }}>
            08:00 - 152 threats
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Average
          </p>
          <p className="text-lg font-bold" style={{ color: COLORS.text }}>
            {(hourlyThreatsData.reduce((sum, d) => sum + d.threats, 0) / hourlyThreatsData.length).toFixed(0)} threats/hour
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Detection Rate
          </p>
          <p className="text-lg font-bold" style={{ color: CHART_COLORS.cyan }}>
            87.2%
          </p>
        </div>
      </div>
    </div>
  );
}
