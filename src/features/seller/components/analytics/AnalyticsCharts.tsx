import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export interface ChartDataPoint {
  label: string;
  revenue: number;
  sales: number;
  orders: number;
  newCustomers: number;
  returningCustomers: number;
}

interface AnalyticsChartsProps {
  data: ChartDataPoint[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<Record<string, number | null>>({
    revenue: null,
    sales: null,
    orders: null,
    customers: null,
  });

  const setHover = (chart: string, idx: number | null) => {
    setHoveredIdx(prev => ({ ...prev, [chart]: idx }));
  };

  // Dimensions
  const width = 520;
  const height = 200;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
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

  // 1. Revenue Calculations
  const revenuePoints = data.map(d => d.revenue);
  const totalRevenue = revenuePoints.reduce((a, b) => a + b, 0);
  const maxRevenue = Math.max(...revenuePoints, 0);
  const revenueCoords = getCoordinates(revenuePoints, maxRevenue);

  // Path generators
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

  // 2. Orders Calculations
  const ordersPoints = data.map(d => d.orders);
  const totalOrders = ordersPoints.reduce((a, b) => a + b, 0);
  const maxOrders = Math.max(...ordersPoints, 0);
  const ordersCoords = getCoordinates(ordersPoints, maxOrders);

  // 3. Sales (Bar Chart)
  const salesPoints = data.map(d => d.sales);
  const totalSales = salesPoints.reduce((a, b) => a + b, 0);
  const maxSales = Math.max(...salesPoints, 0);
  const salesCoords = getCoordinates(salesPoints, maxSales);

  // 4. Customers (New vs Returning Stacked)
  const newCustPoints = data.map(d => d.newCustomers);
  const retCustPoints = data.map(d => d.returningCustomers);
  const totalNewCust = newCustPoints.reduce((a, b) => a + b, 0);
  const totalRetCust = retCustPoints.reduce((a, b) => a + b, 0);
  const totalCust = totalNewCust + totalRetCust;

  // Render a clean SVG Donut for Customer distribution
  const newPct = totalCust === 0 ? 50 : (totalNewCust / totalCust) * 100;
  const retPct = totalCust === 0 ? 50 : (totalRetCust / totalCust) * 100;

  // Donut path params
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  const newStrokeOffset = circ - (newPct / 100) * circ;
  const retStrokeOffset = circ - (retPct / 100) * circ;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      
      {/* Chart 1: Revenue Line/Area Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Revenue Stream</span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide">
              <ArrowUpRight size={10} /> +12.4%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        {/* SVG Container */}
        <div className="relative pt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * chartHeight;
              return (
                <line
                  key={ratio}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  className="stroke-slate-100"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill */}
            <path d={generateAreaPath(revenueCoords)} fill="url(#revenueGrad)" />

            {/* Line Path */}
            <path
              d={generateLinePath(revenueCoords)}
              fill="none"
              className="stroke-emerald-500"
              strokeWidth={2.5}
            />

            {/* Dynamic Interactive Dots */}
            {revenueCoords.map((coord, idx) => (
              <g key={idx}>
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={hoveredIdx.revenue === idx ? 6 : 4}
                  className={`${
                    hoveredIdx.revenue === idx ? 'fill-emerald-600 stroke-white' : 'fill-white stroke-emerald-500'
                  }`}
                  strokeWidth={2}
                  onMouseEnter={() => setHover('revenue', idx)}
                  onMouseLeave={() => setHover('revenue', null)}
                />
                
                {/* Invisible Hover Hitbox */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={15}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover('revenue', idx)}
                  onMouseLeave={() => setHover('revenue', null)}
                />
              </g>
            ))}

            {/* X Axis Labels */}
            {data.map((d, idx) => (
              <text
                key={idx}
                x={getX(idx)}
                y={height - 5}
                textAnchor="middle"
                className="fill-slate-400 font-bold text-[9px]"
              >
                {d.label}
              </text>
            ))}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIdx.revenue !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-xl px-2.5 py-1.5 text-[10px] font-bold shadow-lg pointer-events-none -translate-x-1/2 -translate-y-12 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${(revenueCoords[hoveredIdx.revenue].x / width) * 100}%`,
                top: `${(revenueCoords[hoveredIdx.revenue].y / height) * 100}%`,
              }}
            >
              <div className="font-extrabold text-[9px] text-slate-400 leading-none mb-0.5">{data[hoveredIdx.revenue].label}</div>
              <div className="text-emerald-400 font-black">${revenuePoints[hoveredIdx.revenue].toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Sales Column / Bar Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sales Volume</span>
            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide">
              <TrendingUp size={10} /> +8.5%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">
            {totalSales.toLocaleString()} <span className="text-xs text-slate-450 font-bold">units</span>
          </h3>
        </div>

        {/* SVG Container */}
        <div className="relative pt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * chartHeight;
              return (
                <line
                  key={ratio}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  className="stroke-slate-100"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Bars */}
            {salesCoords.map((coord, idx) => {
              const barWidth = 28;
              const xPos = coord.x - barWidth / 2;
              const barHeight = paddingTop + chartHeight - coord.y;

              return (
                <g key={idx}>
                  <rect
                    x={xPos}
                    y={coord.y}
                    width={barWidth}
                    height={barHeight}
                    rx={6}
                    fill="url(#salesGrad)"
                    className={`transition-opacity cursor-pointer ${
                      hoveredIdx.sales === idx ? 'opacity-100' : 'opacity-85'
                    }`}
                    onMouseEnter={() => setHover('sales', idx)}
                    onMouseLeave={() => setHover('sales', null)}
                  />
                </g>
              );
            })}

            {/* X Axis Labels */}
            {data.map((d, idx) => (
              <text
                key={idx}
                x={getX(idx)}
                y={height - 5}
                textAnchor="middle"
                className="fill-slate-400 font-bold text-[9px]"
              >
                {d.label}
              </text>
            ))}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIdx.sales !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-xl px-2.5 py-1.5 text-[10px] font-bold shadow-lg pointer-events-none -translate-x-1/2 -translate-y-12 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${(salesCoords[hoveredIdx.sales].x / width) * 100}%`,
                top: `${(salesCoords[hoveredIdx.sales].y / height) * 100}%`,
              }}
            >
              <div className="font-extrabold text-[9px] text-slate-400 leading-none mb-0.5">{data[hoveredIdx.sales].label}</div>
              <div className="text-indigo-300 font-black">{salesPoints[hoveredIdx.sales]} units</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart 3: Orders Area Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Orders Traffic</span>
            <span className="text-[10px] font-black text-indigo-755 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide">
              <ShoppingBag size={10} /> +15.2%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">
            {totalOrders.toLocaleString()} <span className="text-xs text-slate-450 font-bold">orders</span>
          </h3>
        </div>

        {/* SVG Container */}
        <div className="relative pt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * chartHeight;
              return (
                <line
                  key={ratio}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  className="stroke-slate-100"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill */}
            <path d={generateAreaPath(ordersCoords)} fill="url(#ordersGrad)" />

            {/* Line Path */}
            <path
              d={generateLinePath(ordersCoords)}
              fill="none"
              className="stroke-blue-500"
              strokeWidth={2.5}
            />

            {/* Dynamic Interactive Dots */}
            {ordersCoords.map((coord, idx) => (
              <g key={idx}>
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={hoveredIdx.orders === idx ? 6 : 4}
                  className={`${
                    hoveredIdx.orders === idx ? 'fill-blue-600 stroke-white' : 'fill-white stroke-blue-500'
                  }`}
                  strokeWidth={2}
                  onMouseEnter={() => setHover('orders', idx)}
                  onMouseLeave={() => setHover('orders', null)}
                />
                
                {/* Invisible Hover Hitbox */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={15}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover('orders', idx)}
                  onMouseLeave={() => setHover('orders', null)}
                />
              </g>
            ))}

            {/* X Axis Labels */}
            {data.map((d, idx) => (
              <text
                key={idx}
                x={getX(idx)}
                y={height - 5}
                textAnchor="middle"
                className="fill-slate-400 font-bold text-[9px]"
              >
                {d.label}
              </text>
            ))}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIdx.orders !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-xl px-2.5 py-1.5 text-[10px] font-bold shadow-lg pointer-events-none -translate-x-1/2 -translate-y-12 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${(ordersCoords[hoveredIdx.orders].x / width) * 100}%`,
                top: `${(ordersCoords[hoveredIdx.orders].y / height) * 100}%`,
              }}
            >
              <div className="font-extrabold text-[9px] text-slate-400 leading-none mb-0.5">{data[hoveredIdx.orders].label}</div>
              <div className="text-blue-400 font-black">{ordersPoints[hoveredIdx.orders]} orders</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart 4: Customer Distribution Donut Chart */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer Registry</span>
            <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide">
              <Users size={10} /> +5.4%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1 leading-none">
            {totalCust.toLocaleString()} <span className="text-xs text-slate-455 font-bold">Total Accounts</span>
          </h3>
        </div>

        {/* Donut layout */}
        <div className="flex items-center justify-around gap-6 h-[140px] pt-1">
          {/* Donut SVG */}
          <div className="relative w-32 h-32 select-none shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 120 120" className="-rotate-90">
              {/* Background circle */}
              <circle cx="60" cy="60" r={radius} fill="none" className="stroke-slate-100" strokeWidth="12" />
              
              {/* Returning Customers Segment (Purple) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                className="stroke-purple-600"
                strokeWidth="12"
                strokeDasharray={circ}
                strokeDashoffset={retStrokeOffset}
              />

              {/* New Customers Segment (Indigo) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                className="stroke-indigo-650"
                strokeWidth="12"
                strokeDasharray={circ}
                strokeDashoffset={newStrokeOffset}
                // Rotates to start where returning ends
                transform={`rotate(${(totalRetCust / (totalCust || 1)) * 360} 60 60)`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">New Share</span>
              <span className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">{newPct.toFixed(0)}%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3.5 flex-grow max-w-[200px]">
            {/* New Customers */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center gap-1.5 text-slate-650">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-650" />
                  <span>New Registries</span>
                </span>
                <span className="text-slate-800">{totalNewCust.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-650 h-full" style={{ width: `${newPct}%` }} />
              </div>
            </div>

            {/* Returning Customers */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center gap-1.5 text-slate-650">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                  <span>Returning Buyers</span>
                </span>
                <span className="text-slate-800">{totalRetCust.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full" style={{ width: `${retPct}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

const getX = (index: number) => {
  const paddingLeft = 45;
  const paddingRight = 15;
  const width = 520;
  const chartWidth = width - paddingLeft - paddingRight;
  // hardcode 6 points
  return paddingLeft + (index / 5) * chartWidth;
};

export default AnalyticsCharts;
