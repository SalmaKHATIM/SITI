'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { COLORS } from '@/utils/constants';

interface KPICardProps {
  title: string;
  value: number | string;
  change: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  showPercent?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  unit = '',
  icon,
  color,
  showPercent = true,
}: KPICardProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? COLORS.success : COLORS.danger;

  return (
    <div
      className="rounded-lg p-6 border backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: COLORS.textSecondary }}>
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: COLORS.text }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span style={{ color: COLORS.textSecondary }}>{unit}</span>}
          </div>
        </div>
        <div
          className="p-3 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center gap-1" style={{ color: changeColor }}>
        {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="text-sm font-semibold">
          {Math.abs(change).toFixed(1)}{showPercent ? '%' : ''} from yesterday
        </span>
      </div>
    </div>
  );
}
