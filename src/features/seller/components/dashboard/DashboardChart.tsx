import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';

type ChartType = 'sales' | 'revenue' | 'orders' | 'performance';

interface DataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export const DashboardChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChartType>('sales');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Mock data for charts
  const chartData: Record<ChartType, { title: string; prefix: string; suffix: string; points: DataPoint[]; color: string; fillGradient: string }> = {
    sales: {
      title: 'Sales Overview',
      prefix: '',
      suffix: ' units',
      color: 'stroke-indigo-650',
      fillGradient: 'url(#indigoGradient)',
      points: [
        { label: 'Jan', value: 320 },
        { label: 'Feb', value: 450 },
        { label: 'Mar', value: 410 },
        { label: 'Apr', value: 600 },
        { label: 'May', value: 720 },
        { label: 'Jun', value: 890 }
      ]
    },
    revenue: {
      title: 'Revenue Analytics',
      prefix: '$',
      suffix: '',
      color: 'stroke-emerald-600',
      fillGradient: 'url(#emeraldGradient)',
      points: [
        { label: 'Jan', value: 2400 },
        { label: 'Feb', value: 3100 },
        { label: 'Mar', value: 2900 },
        { label: 'Apr', value: 4200 },
        { label: 'May', value: 5100 },
        { label: 'Jun', value: 6250 }
      ]
    },
    orders: {
      title: 'Order Analytics',
      prefix: '',
      suffix: ' orders',
      color: 'stroke-blue-600',
      fillGradient: 'url(#blueGradient)',
      points: [
        { label: 'Jan', value: 80 },
        { label: 'Feb', value: 110 },
        { label: 'Mar', value: 95 },
        { label: 'Apr', value: 150 },
        { label: 'May', value: 180 },
        { label: 'Jun', value: 220 }
      ]
    },
    performance: {
      title: 'Category Performance',
      prefix: '',
      suffix: '% share',
      color: 'stroke-purple-600',
      fillGradient: 'url(#purpleGradient)',
      points: [
        { label: 'Fashion', value: 42, secondary: 35 },
        { label: 'Digital', value: 28, secondary: 25 },
        { label: 'Kitchen', value: 18, secondary: 20 },
        { label: 'Wellness', value: 12, secondary: 20 }
      ]
    }
  };

  const currentChart = chartData[activeTab];

  // SVG Chart Calculation Helpers
  const width = 600;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...currentChart.points.map(p => p.value)) * 1.15;
  const minVal = 0;

  const getX = (index: number) => {
    return paddingLeft + (index / (currentChart.points.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const scale = (val - minVal) / (maxVal - minVal);
    return paddingTop + chartHeight - scale * chartHeight;
  };

  // Build points path string for line chart
  const linePath = currentChart.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${getX(idx)},${getY(p.value)}`).join(' ');
  const areaPath = `${linePath} L${getX(currentChart.points.length - 1)},${getY(0)} L${getX(0)},${getY(0)} Z`;



  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between text-left">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 leading-none">
            <BarChart2 size={16} className="text-indigo-650" />
            <span>Store Charts Insights</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Real-time analytical graphs mapping your storefront operations.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-50 border border-slate-150/50 p-1 rounded-xl self-start sm:self-center">
          {(['sales', 'revenue', 'orders', 'performance'] as ChartType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all capitalize cursor-pointer ${
                activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-3xs' 
                  : 'text-slate-450 hover:text-slate-700'
              }`}
            >
              {tab === 'performance' ? 'Categories' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Component */}
      <div className="relative w-full h-[240px]">
        
        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div 
            className="absolute bg-slate-900/95 backdrop-blur-xs text-white border border-slate-750 p-2.5 rounded-xl text-[10px] font-bold shadow-xl space-y-0.5 pointer-events-none transition-all z-20"
            style={{
              left: `${(getX(hoveredIdx) / width) * 100}%`,
              transform: 'translate(-50%, -110%)',
              top: `${(getY(currentChart.points[hoveredIdx].value) / height) * 100}%`
            }}
          >
            <p className="text-slate-400 text-[9px] uppercase font-black leading-none mb-1">
              {currentChart.points[hoveredIdx].label}
            </p>
            <p className="text-white font-black text-xs leading-none">
              {currentChart.prefix}
              {currentChart.points[hoveredIdx].value}
              {currentChart.suffix}
            </p>
            {activeTab === 'performance' && (
              <p className="text-slate-400 text-[8px] font-semibold mt-0.5">
                Prev: {currentChart.points[hoveredIdx].secondary}%
              </p>
            )}
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            {/* Gradients */}
            <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((scale, idx) => {
            const y = paddingTop + scale * chartHeight;
            const val = maxVal - scale * (maxVal - minVal);
            return (
              <g key={idx} className="opacity-40">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#e2e8f0" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3} 
                  textAnchor="end" 
                  className="fill-slate-400 font-bold text-[9px]"
                >
                  {currentChart.prefix}{Math.round(val)}{currentChart.suffix.includes('%') ? '%' : ''}
                </text>
              </g>
            );
          })}

          {/* Render charts depending on active tabs */}
          {activeTab === 'performance' ? (
            // Bar chart presentation for Categories
            currentChart.points.map((p, idx) => {
              const xCenter = paddingLeft + (idx + 0.5) * (chartWidth / currentChart.points.length);
              const barWidth = 35;
              const yVal = getY(p.value);
              const ySec = getY(p.secondary || 0);
              
              return (
                <g key={idx} className="group/bar">
                  {/* Secondary comparison bar */}
                  <rect
                    x={xCenter - barWidth - 2}
                    y={ySec}
                    width={barWidth}
                    height={paddingTop + chartHeight - ySec}
                    className="fill-slate-200 transition-all rounded-t-sm"
                    rx="2"
                  />
                  {/* Primary bar */}
                  <rect
                    x={xCenter + 2}
                    y={yVal}
                    width={barWidth}
                    height={paddingTop + chartHeight - yVal}
                    className="fill-purple-500 hover:fill-purple-650 transition-all rounded-t-sm cursor-pointer"
                    rx="2"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                </g>
              );
            })
          ) : (
            // Line / Area chart for Sales, Revenue, Orders
            <>
              {/* Area Under Curve */}
              <path 
                d={areaPath} 
                fill={currentChart.fillGradient} 
              />
              
              {/* Line path */}
              <path 
                d={linePath} 
                fill="none" 
                className={`${currentChart.color}`}
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots and interactive points */}
              {currentChart.points.map((p, idx) => {
                const cx = getX(idx);
                const cy = getY(p.value);
                const isHovered = hoveredIdx === idx;
                
                return (
                  <g key={idx}>
                    {/* Hover hotspot */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="12" 
                      fill="transparent" 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                    {/* Visual dot */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isHovered ? "6" : "4.5"} 
                      className={`fill-white ${currentChart.color} transition-all pointer-events-none`}
                      strokeWidth={isHovered ? "3" : "2"}
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* X Axis Labels */}
          {currentChart.points.map((p, idx) => {
            const x = activeTab === 'performance'
              ? paddingLeft + (idx + 0.5) * (chartWidth / currentChart.points.length)
              : getX(idx);
            return (
              <text 
                key={idx} 
                x={x} 
                y={height - paddingBottom + 18} 
                textAnchor="middle" 
                className="fill-slate-450 font-bold text-[9px] select-none"
              >
                {p.label}
              </text>
            );
          })}
        </svg>

      </div>

      {/* Chart Legend / Description */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100/70 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${activeTab === 'sales' ? 'bg-indigo-600' : activeTab === 'revenue' ? 'bg-emerald-500' : activeTab === 'orders' ? 'bg-blue-500' : 'bg-purple-500'}`} />
          <span>Current Period (2026)</span>
        </div>
        {activeTab === 'performance' && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span>Target/Previous Share</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardChart;
