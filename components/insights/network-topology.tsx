'use client';

import { Server, AlertCircle, CheckCircle } from 'lucide-react';
import { COLORS, STATUS_COLORS } from '@/utils/constants';
import { networkTopologyData } from '@/utils/mock-data';

export function NetworkTopology() {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || COLORS.info;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'healthy') {
      return <CheckCircle size={20} />;
    } else if (status === 'critical') {
      return <AlertCircle size={20} />;
    }
    return <Server size={20} />;
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
        Network Topology Overview
      </h2>

      {/* SVG Network Visualization */}
      <svg viewBox="0 0 600 300" className="w-full h-auto mb-6">
        <defs>
          <style>{`
            .node-connection { stroke: ${COLORS.accent}; opacity: 0.5; stroke-width: 2; }
            .node-critical { stroke: ${STATUS_COLORS.critical}; }
            .node-warning { stroke: ${STATUS_COLORS.warning}; }
            .node-healthy { stroke: ${STATUS_COLORS.healthy}; }
          `}</style>
        </defs>

        {/* Connections */}
        <line x1="60" y1="60" x2="200" y2="100" className="node-connection" />
        <line x1="60" y1="60" x2="300" y2="150" className="node-connection" />
        <line x1="200" y1="100" x2="300" y2="150" className="node-connection" />
        <line x1="300" y1="150" x2="450" y2="100" className="node-connection" />
        <line x1="200" y1="100" x2="200" y2="220" className="node-connection" />
        <line x1="450" y1="100" x2="350" y2="220" className="node-connection" />

        {/* Nodes */}
        {networkTopologyData.map((node) => (
          <g key={node.id}>
            {/* Node Circle */}
            <circle
              cx={node.x * 5.5}
              cy={node.y * 4}
              r="25"
              fill={COLORS.secondary}
              className={`node-${node.status}`}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            />
            {/* Label */}
            <text
              x={node.x * 5.5}
              y={node.y * 4 + 35}
              textAnchor="middle"
              fill={COLORS.text}
              fontSize="11"
              fontWeight="bold"
            >
              {node.name}
            </text>
            {/* Threat Count */}
            <circle
              cx={node.x * 5.5 + 20}
              cy={node.y * 4 - 20}
              r="12"
              fill={STATUS_COLORS[node.status as keyof typeof STATUS_COLORS] || COLORS.info}
              style={{ opacity: 0.8 }}
            />
            <text
              x={node.x * 5.5 + 20}
              y={node.y * 4 - 16}
              textAnchor="middle"
              fill={COLORS.surface}
              fontSize="10"
              fontWeight="bold"
            >
              {node.threats}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
        {networkTopologyData.map((node) => (
          <div
            key={node.id}
            className="p-3 rounded-lg flex items-center gap-3"
            style={{
              backgroundColor: COLORS.secondary,
              borderLeft: `3px solid ${getStatusColor(node.status)}`,
            }}
          >
            <div
              className="p-2 rounded"
              style={{ backgroundColor: COLORS.border }}
            >
              <Server size={16} style={{ color: getStatusColor(node.status) }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: COLORS.text }}>
                {node.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(node.status)}
                <span
                  className="text-xs font-semibold capitalize"
                  style={{ color: getStatusColor(node.status) }}
                >
                  {node.status}
                </span>
              </div>
            </div>
            <div
              className="px-2 py-1 rounded text-xs font-bold"
              style={{
                backgroundColor: getStatusColor(node.status),
                color: COLORS.surface,
              }}
            >
              {node.threats}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
