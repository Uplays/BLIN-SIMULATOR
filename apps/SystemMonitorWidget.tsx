import React from 'react';

interface SystemMonitorWidgetProps {
  widgetId: string;
}

const SystemMonitorWidget: React.FC<SystemMonitorWidgetProps> = ({ widgetId }) => {
  // Simulated data
  const cpuUsage = 25; // %
  const ramUsedGB = 1; // GB
  const ramTotalGB = 8; // GB
  const ramUsagePercentage = Math.round((ramUsedGB / ramTotalGB) * 100);

  const renderCircularProgress = (percentage: number, label: string) => (
    <div className="relative w-20 h-20 flex flex-col items-center justify-center">
      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-white/20"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className="text-blue-400"
          strokeWidth="8"
          strokeDasharray={40 * 2 * Math.PI}
          strokeDashoffset={40 * 2 * Math.PI - (percentage / 100) * (40 * 2 * Math.PI)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)" // Start from top
          style={{ transition: 'stroke-dashoffset 0.35s ease' }}
        />
      </svg>
      <span className="text-xl font-bold text-white z-10">{percentage}%</span>
      <p className="absolute bottom-1 text-xs text-white/70">{label}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full text-white p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-blue-200">System Monitor</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>

      <div className="flex justify-around items-center flex-grow">
        {renderCircularProgress(cpuUsage, 'CPU')}
        {renderCircularProgress(ramUsagePercentage, 'RAM')}
      </div>

      <div className="mt-3 text-sm text-white/70 text-center">
        <p>CPU Usage: <span className="text-white/90">{cpuUsage}%</span></p>
        <p>RAM: <span className="text-white/90">{ramUsedGB}GB / {ramTotalGB}GB</span></p>
      </div>
    </div>
  );
};

export default SystemMonitorWidget;