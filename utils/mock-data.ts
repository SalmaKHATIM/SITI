// Mock data for AI Insights cybersecurity dashboard

export const kpiData = {
  threatsDetected: 1247,
  threatsChange: 12.5,
  anomalies: 89,
  anomaliesChange: -8.3,
  systemHealth: 94.2,
  systemHealthChange: 2.1,
  compliance: 96.8,
  complianceChange: 0.5,
};

export const hourlyThreatsData = [
  { hour: '00:00', threats: 45, ai_detected: 38, anomalies: 3 },
  { hour: '01:00', threats: 32, ai_detected: 28, anomalies: 2 },
  { hour: '02:00', threats: 28, ai_detected: 24, anomalies: 1 },
  { hour: '03:00', threats: 35, ai_detected: 31, anomalies: 2 },
  { hour: '04:00', threats: 52, ai_detected: 45, anomalies: 4 },
  { hour: '05:00', threats: 68, ai_detected: 58, anomalies: 5 },
  { hour: '06:00', threats: 95, ai_detected: 82, anomalies: 8 },
  { hour: '07:00', threats: 128, ai_detected: 110, anomalies: 12 },
  { hour: '08:00', threats: 152, ai_detected: 132, anomalies: 15 },
  { hour: '09:00', threats: 145, ai_detected: 125, anomalies: 14 },
  { hour: '10:00', threats: 138, ai_detected: 120, anomalies: 13 },
  { hour: '11:00', threats: 115, ai_detected: 100, anomalies: 10 },
  { hour: '12:00', threats: 98, ai_detected: 85, anomalies: 8 },
  { hour: '13:00', threats: 92, ai_detected: 80, anomalies: 7 },
  { hour: '14:00', threats: 87, ai_detected: 76, anomalies: 6 },
  { hour: '15:00', threats: 102, ai_detected: 89, anomalies: 9 },
  { hour: '16:00', threats: 118, ai_detected: 103, anomalies: 11 },
  { hour: '17:00', threats: 135, ai_detected: 118, anomalies: 13 },
  { hour: '18:00', threats: 142, ai_detected: 124, anomalies: 14 },
  { hour: '19:00', threats: 128, ai_detected: 112, anomalies: 12 },
  { hour: '20:00', threats: 105, ai_detected: 92, anomalies: 9 },
  { hour: '21:00', threats: 78, ai_detected: 68, anomalies: 6 },
  { hour: '22:00', threats: 62, ai_detected: 54, anomalies: 4 },
  { hour: '23:00', threats: 48, ai_detected: 42, anomalies: 3 },
];

export const threatTypeDistribution = [
  { name: 'Malware', value: 324, percentage: 26 },
  { name: 'Phishing', value: 287, percentage: 23 },
  { name: 'DDoS', value: 245, percentage: 20 },
  { name: 'Brute Force', value: 198, percentage: 16 },
  { name: 'SQL Injection', value: 115, percentage: 9 },
  { name: 'Zero-Day', value: 78, percentage: 6 },
];

export const severityDistribution = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 145, color: '#f97316' },
  { name: 'Medium', value: 524, color: '#eab308' },
  { name: 'Low', value: 566, color: '#84cc16' },
];

export const threatHeatmapData = [
  { time: '00:00', severity: 2, count: 45 },
  { time: '01:00', severity: 1, count: 32 },
  { time: '02:00', severity: 1, count: 28 },
  { time: '03:00', severity: 2, count: 35 },
  { time: '04:00', severity: 2, count: 52 },
  { time: '05:00', severity: 3, count: 68 },
  { time: '06:00', severity: 3, count: 95 },
  { time: '07:00', severity: 4, count: 128 },
  { time: '08:00', severity: 4, count: 152 },
  { time: '09:00', severity: 3, count: 145 },
  { time: '10:00', severity: 3, count: 138 },
  { time: '11:00', severity: 2, count: 115 },
  { time: '12:00', severity: 2, count: 98 },
  { time: '13:00', severity: 2, count: 92 },
  { time: '14:00', severity: 2, count: 87 },
  { time: '15:00', severity: 3, count: 102 },
  { time: '16:00', severity: 3, count: 118 },
  { time: '17:00', severity: 4, count: 135 },
  { time: '18:00', severity: 4, count: 142 },
  { time: '19:00', severity: 3, count: 128 },
  { time: '20:00', severity: 2, count: 105 },
  { time: '21:00', severity: 2, count: 78 },
  { time: '22:00', severity: 1, count: 62 },
  { time: '23:00', severity: 1, count: 48 },
];

export const incidentTimelineData = [
  {
    id: 1,
    time: '2024-01-15 14:32',
    type: 'Malware Detection',
    severity: 'critical',
    description: 'Advanced persistent threat detected on Server-05',
    status: 'contained',
  },
  {
    id: 2,
    time: '2024-01-15 13:18',
    type: 'Brute Force Attack',
    severity: 'high',
    description: 'Failed login attempts detected on API Gateway',
    status: 'mitigated',
  },
  {
    id: 3,
    time: '2024-01-15 12:05',
    type: 'Anomalous Behavior',
    severity: 'medium',
    description: 'Unusual data access patterns detected in Database-02',
    status: 'investigating',
  },
  {
    id: 4,
    time: '2024-01-15 10:42',
    type: 'DDoS Attack',
    severity: 'high',
    description: 'Traffic spike detected on Load Balancer-01',
    status: 'mitigated',
  },
  {
    id: 5,
    time: '2024-01-15 08:15',
    type: 'Suspicious Login',
    severity: 'medium',
    description: 'Login from new geolocation detected',
    status: 'contained',
  },
];

export const networkTopologyData = [
  {
    id: 1,
    name: 'Web Server',
    type: 'server',
    status: 'healthy',
    threats: 12,
    x: 10,
    y: 20,
  },
  {
    id: 2,
    name: 'API Gateway',
    type: 'gateway',
    status: 'warning',
    threats: 8,
    x: 50,
    y: 10,
  },
  {
    id: 3,
    name: 'Database',
    type: 'database',
    status: 'healthy',
    threats: 3,
    x: 90,
    y: 20,
  },
  {
    id: 4,
    name: 'Load Balancer',
    type: 'network',
    status: 'critical',
    threats: 15,
    x: 50,
    y: 50,
  },
  {
    id: 5,
    name: 'Cache Server',
    type: 'server',
    status: 'healthy',
    threats: 5,
    x: 30,
    y: 70,
  },
  {
    id: 6,
    name: 'Backup Storage',
    type: 'storage',
    status: 'healthy',
    threats: 1,
    x: 70,
    y: 70,
  },
];

export const complianceMetricsData = [
  { standard: 'GDPR', compliance: 98, required: 100 },
  { standard: 'HIPAA', compliance: 95, required: 100 },
  { standard: 'PCI-DSS', compliance: 92, required: 100 },
  { standard: 'ISO 27001', compliance: 97, required: 100 },
  { standard: 'SOC 2', compliance: 96, required: 100 },
];

export const aiDetectionInsightsData = [
  {
    id: 1,
    insight: 'Machine learning model detected 1,247 threats with 99.2% accuracy',
    confidence: 99.2,
    category: 'Detection',
  },
  {
    id: 2,
    insight: 'Anomaly detection algorithm identified 89 unusual patterns',
    confidence: 94.7,
    category: 'Anomaly',
  },
  {
    id: 3,
    insight: 'Predictive analysis indicates 23% increase in threat activity tomorrow',
    confidence: 87.3,
    category: 'Prediction',
  },
  {
    id: 4,
    insight: 'Behavioral analysis flagged 5 new threat patterns requiring investigation',
    confidence: 91.2,
    category: 'Analysis',
  },
  {
    id: 5,
    insight: 'Correlation analysis linked 34 incidents to 2 distinct threat actors',
    confidence: 96.8,
    category: 'Correlation',
  },
];

export const topAttackVectorsData = [
  { vector: 'Network Reconnaissance', attempts: 342, blocked: 340, percentage: 99.4 },
  { vector: 'Credential Stuffing', attempts: 287, blocked: 285, percentage: 99.3 },
  { vector: 'Exploitation Attempts', attempts: 156, blocked: 154, percentage: 98.7 },
  { vector: 'Lateral Movement', attempts: 89, blocked: 87, percentage: 97.8 },
  { vector: 'Data Exfiltration', attempts: 45, blocked: 44, percentage: 97.8 },
  { vector: 'Privilege Escalation', attempts: 23, blocked: 22, percentage: 95.7 },
];

export const systemHealthData = [
  { component: 'CPU Usage', value: 62, threshold: 80 },
  { component: 'Memory Usage', value: 74, threshold: 85 },
  { component: 'Disk I/O', value: 48, threshold: 70 },
  { component: 'Network Latency', value: 32, threshold: 50 },
  { component: 'Error Rate', value: 0.2, threshold: 1.0 },
];
