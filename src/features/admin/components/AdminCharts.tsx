import React, { useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

interface ChartPoint {
  label: string;
  revenue: number;
  orders: number;
  sellers: number;
}

const mockData: ChartPoint[] = [
  { label: 'Jan', revenue: 35000, orders: 480, sellers: 85 },
  { label: 'Feb', revenue: 42000, orders: 590, sellers: 96 },
  { label: 'Mar', revenue: 38000, orders: 510, sellers: 104 },
  { label: 'Apr', revenue: 56000, orders: 720, sellers: 115 },
  { label: 'May', revenue: 48000, orders: 680, sellers: 128 },
  { label: 'Jun', revenue: 75950, orders: 840, sellers: 142 },
];

export const AdminCharts: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<Record<string, number | null>>({
    revenue: null,
    orders: null,
    sellers: null,
  });

  const width = 450;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getCoordinates = (points: number[], maxVal: number) => {
    const minVal = 0;
    const adjustedMax = maxVal === 0 ? 10 : maxVal * 1.15;
    return points.map((val, idx) => {
      const x = paddingLeft + (idx / (points.length - 1)) * chartWidth;
      const scale = (val - minVal) / (adjustedMax - minVal);
      const y = paddingTop + chartHeight - scale * chartHeight;
      return { x, y, val };
    });
  };

  // Helper generators
  const generateLinePath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    return coords.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  const generateAreaPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    const linePath = generateLinePath(coords);
    return `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`;
  };

  // 1. Revenue Coordinates (Area Line)
  const revenuePoints = mockData.map((d) => d.revenue);
  const maxRevenue = Math.max(...revenuePoints, 0);
  const revenueCoords = getCoordinates(revenuePoints, maxRevenue);

  // 2. Orders Coordinates (Bar Chart)
  const ordersPoints = mockData.map((d) => d.orders);
  const maxOrders = Math.max(...ordersPoints, 0);
  const ordersCoords = getCoordinates(ordersPoints, maxOrders);

  // 3. Seller Growth Coordinates (Step or Standard Line)
  const sellerPoints = mockData.map((d) => d.sellers);
  const maxSellers = Math.max(...sellerPoints, 0);
  const sellerCoords = getCoordinates(sellerPoints, maxSellers);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* Revenue Area Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Revenue Overview</span>
            <DollarSign size={14} className="text-indigo-600" />
          </div>
          <h5 className="text-base font-black text-slate-805">$75,950.00</h5>
          <span className="text-[9px] font-bold text-slate-400 block mt-0.5">Peak revenue in June</span>
        </div>

        <div className="mt-4 relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Gradients */}
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = paddingTop + r * chartHeight;
              return (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              );
            })}

            {/* Area path */}
            <path d={generateAreaPath(revenueCoords)} fill="url(#revenueGrad)" />

            {/* Line path */}
            <path
              d={generateLinePath(revenueCoords)}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Hover Guides & Dots */}
            {revenueCoords.map((pt, idx) => {
              const isHovered = hoveredIdx.revenue === idx;
              return (
                <g key={idx}>
                  {/* Invisible touch target */}
                  <rect
                    x={pt.x - 15}
                    y={paddingTop}
                    width="30"
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, revenue: idx }))}
                    onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, revenue: null }))}
                  />

                  {isHovered && (
                    <>
                      <line
                        x1={pt.x}
                        y1={paddingTop}
                        x2={pt.x}
                        y2={paddingTop + chartHeight}
                        stroke="#818cf8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                    </>
                  )}
                </g>
              );
            })}

            {/* Labels */}
            {mockData.map((d, idx) => {
              const x = paddingLeft + (idx / (mockData.length - 1)) * chartWidth;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>

          {/* Dynamic Tooltip overlay */}
          {hoveredIdx.revenue !== null && (
            <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md select-none pointer-events-none">
              {mockData[hoveredIdx.revenue].label}: ${mockData[hoveredIdx.revenue].revenue.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Orders Bar Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Orders Overview</span>
            <ShoppingCart size={14} className="text-emerald-600" />
          </div>
          <h5 className="text-base font-black text-slate-805">840 Orders</h5>
          <span className="text-[9px] font-bold text-slate-400 block mt-0.5">Highest order volume in June</span>
        </div>

        <div className="mt-4 relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = paddingTop + r * chartHeight;
              return (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              );
            })}

            {/* Bars */}
            {ordersCoords.map((pt, idx) => {
              const barWidth = 14;
              const barHeight = paddingTop + chartHeight - pt.y;
              const isHovered = hoveredIdx.orders === idx;

              return (
                <g key={idx}>
                  <rect
                    x={pt.x - barWidth / 2}
                    y={pt.y}
                    width={barWidth}
                    height={barHeight}
                    rx="3"
                    fill={isHovered ? '#059669' : '#10b981'}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, orders: idx }))}
                    onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, orders: null }))}
                  />

                  {/* Invisible target */}
                  <rect
                    x={pt.x - 20}
                    y={paddingTop}
                    width="40"
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer pointer-events-none"
                  />
                </g>
              );
            })}

            {/* Labels */}
            {mockData.map((d, idx) => {
              const x = paddingLeft + (idx / (mockData.length - 1)) * chartWidth;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIdx.orders !== null && (
            <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md select-none pointer-events-none">
              {mockData[hoveredIdx.orders].label}: {mockData[hoveredIdx.orders].orders} orders
            </div>
          )}
        </div>
      </div>

      {/* Seller Growth Line Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Seller Growth</span>
            <TrendingUp size={14} className="text-indigo-650" />
          </div>
          <h5 className="text-base font-black text-slate-805">142 Total Sellers</h5>
          <span className="text-[9px] font-bold text-slate-400 block mt-0.5">+67% growth in six months</span>
        </div>

        <div className="mt-4 relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = paddingTop + r * chartHeight;
              return (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              );
            })}

            {/* Line Path */}
            <path
              d={generateLinePath(sellerCoords)}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Dots */}
            {sellerCoords.map((pt, idx) => {
              const isHovered = hoveredIdx.sellers === idx;
              return (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? '5' : '3'}
                    fill={isHovered ? '#6366f1' : '#ffffff'}
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, sellers: idx }))}
                    onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, sellers: null }))}
                  />

                  {/* Touch targets */}
                  <rect
                    x={pt.x - 15}
                    y={paddingTop}
                    width="30"
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, sellers: idx }))}
                    onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, sellers: null }))}
                  />
                </g>
              );
            })}

            {/* Labels */}
            {mockData.map((d, idx) => {
              const x = paddingLeft + (idx / (mockData.length - 1)) * chartWidth;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIdx.sellers !== null && (
            <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md select-none pointer-events-none">
              {mockData[hoveredIdx.sellers].label}: {mockData[hoveredIdx.sellers].sellers} merchants
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminCharts;
