export type TeaType = 'green' | 'black' | 'oolong' | 'white' | 'puerh' | 'herbal';

export interface TeaTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  accentColor: string;
}

export const TEA_TYPES_CONFIG: Record<TeaType, TeaTypeConfig> = {
  green: {
    label: 'Green Tea',
    color: 'text-green-900',
    bgColor: 'bg-green-50',
    badgeBgColor: 'bg-green-200',
    badgeTextColor: 'text-green-800',
    accentColor: 'bg-green-500',
  },
  black: {
    label: 'Black Tea',
    color: 'text-slate-900',
    bgColor: 'bg-slate-50',
    badgeBgColor: 'bg-slate-200',
    badgeTextColor: 'text-slate-800',
    accentColor: 'bg-slate-600',
  },
  oolong: {
    label: 'Oolong Tea',
    color: 'text-amber-900',
    bgColor: 'bg-amber-50',
    badgeBgColor: 'bg-amber-200',
    badgeTextColor: 'text-amber-800',
    accentColor: 'bg-amber-500',
  },
  white: {
    label: 'White Tea',
    color: 'text-zinc-900',
    bgColor: 'bg-zinc-50',
    badgeBgColor: 'bg-zinc-200',
    badgeTextColor: 'text-zinc-800',
    accentColor: 'bg-zinc-400',
  },
  puerh: {
    label: "Pu'erh Tea",
    color: 'text-orange-900',
    bgColor: 'bg-orange-50',
    badgeBgColor: 'bg-orange-200',
    badgeTextColor: 'text-orange-800',
    accentColor: 'bg-orange-600',
  },
  herbal: {
    label: 'Herbal Tea',
    color: 'text-pink-900',
    bgColor: 'bg-pink-50',
    badgeBgColor: 'bg-pink-200',
    badgeTextColor: 'text-pink-800',
    accentColor: 'bg-pink-500',
  },
};

export function getTeaTypeConfig(type: string): TeaTypeConfig {
  return TEA_TYPES_CONFIG[type as TeaType] || TEA_TYPES_CONFIG.green;
}

export function getTeaTypeLabel(type: string): string {
  return getTeaTypeConfig(type).label;
}
