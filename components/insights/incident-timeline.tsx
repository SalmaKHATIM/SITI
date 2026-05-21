'use client';

import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { COLORS, STATUS_COLORS, SEVERITY_COLORS } from '@/utils/constants';
import { incidentTimelineData } from '@/utils/mock-data';

export function IncidentTimeline() {
  const getSeverityColor = (severity: string) => {
    return SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || COLORS.info;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'contained':
      case 'mitigated':
        return <CheckCircle size={20} />;
      case 'investigating':
        return <Clock size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || COLORS.info;
  };

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.text }}>
        Incident Timeline
      </h2>

      <div className="space-y-4">
        {incidentTimelineData.map((incident, index) => (
          <div key={incident.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className="p-2 rounded-full"
                style={{
                  backgroundColor: getSeverityColor(incident.severity),
                  color: COLORS.surface,
                }}
              >
                {getStatusIcon(incident.status)}
              </div>
              {index < incidentTimelineData.length - 1 && (
                <div
                  className="w-1 h-12 my-2"
                  style={{ backgroundColor: COLORS.border }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold" style={{ color: COLORS.text }}>
                  {incident.type}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: getStatusColor(incident.status),
                    color: COLORS.surface,
                    textTransform: 'capitalize',
                  }}
                >
                  {incident.status}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: COLORS.textSecondary }}>
                {incident.description}
              </p>
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                {incident.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
