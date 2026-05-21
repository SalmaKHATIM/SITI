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
} from 'recharts';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { COLORS, CHART_COLORS } from '@/utils/constants';
import { complianceMetricsData } from '@/utils/mock-data';

export function ComplianceStatus() {
  const getStatusIcon = (compliance: number) => {
    return compliance >= 95 ? (
      <CheckCircle size={18} style={{ color: CHART_COLORS.green }} />
    ) : (
      <AlertCircle size={18} style={{ color: CHART_COLORS.orange }} />
    );
  };

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        Compliance Status
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={complianceMetricsData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            dataKey="standard"
            stroke={COLORS.textSecondary}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={COLORS.textSecondary}
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.accent,
              borderRadius: '8px',
              color: COLORS.text,
            }}
            formatter={(value) => `${value}%`}
          />
          <Legend wrapperStyle={{ color: COLORS.text }} />
          <Bar
            dataKey="compliance"
            fill={CHART_COLORS.cyan}
            name="Current Compliance"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="required"
            fill={COLORS.border}
            name="Required"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        {complianceMetricsData.map((item) => (
          <div
            key={item.standard}
            className="p-3 rounded-lg"
            style={{ backgroundColor: COLORS.secondary }}
          >
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(item.compliance)}
              <span className="text-sm font-semibold" style={{ color: COLORS.text }}>
                {item.standard}
              </span>
            </div>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>
              {item.compliance}% / {item.required}%
            </p>
            <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${item.compliance}%`,
                  backgroundColor: item.compliance >= 95 ? CHART_COLORS.green : CHART_COLORS.yellow,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
