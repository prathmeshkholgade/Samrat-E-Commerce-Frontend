import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Download, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';

interface MetricData {
  revenue: number;
  orders: number;
  sellers: number;
  customers: number;
  products: number;
}

interface ChartPoint {
  label: string;
  revenue: number;
  orders: number;
  sellers: number;
  products: number;
}

// Time-range mock datasets
const RANGE_DATA: Record<'Today' | 'Week' | 'Month' | 'Year', { metrics: MetricData; chart: ChartPoint[] }> = {
  Today: {
    metrics: { revenue: 1450, orders: 24, sellers: 142, customers: 2840, products: 1240 },
    chart: [
      { label: '09:00', revenue: 120, orders: 2, sellers: 142, products: 1240 },
      { label: '12:00', revenue: 450, orders: 8, sellers: 142, products: 1240 },
      { label: '15:00', revenue: 780, orders: 13, sellers: 142, products: 1240 },
      { label: '18:00', revenue: 1120, orders: 19, sellers: 142, products: 1240 },
      { label: '21:00', revenue: 1450, orders: 24, sellers: 142, products: 1240 },
    ]
  },
  Week: {
    metrics: { revenue: 18450, orders: 320, sellers: 142, customers: 2845, products: 1240 },
    chart: [
      { label: 'Mon', revenue: 2100, orders: 35, sellers: 140, products: 1238 },
      { label: 'Tue', revenue: 2800, orders: 48, sellers: 140, products: 1238 },
      { label: 'Wed', revenue: 2400, orders: 42, sellers: 141, products: 1239 },
      { label: 'Thu', revenue: 3100, orders: 54, sellers: 141, products: 1239 },
      { label: 'Fri', revenue: 2900, orders: 50, sellers: 142, products: 1240 },
      { label: 'Sat', revenue: 3500, orders: 61, sellers: 142, products: 1240 },
      { label: 'Sun', revenue: 1650, orders: 30, sellers: 142, products: 1240 },
    ]
  },
  Month: {
    metrics: { revenue: 72950, orders: 840, sellers: 142, customers: 2860, products: 1240 },
    chart: [
      { label: 'Week 1', revenue: 15400, orders: 180, sellers: 138, products: 1235 },
      { label: 'Week 2', revenue: 18200, orders: 210, sellers: 139, products: 1237 },
      { label: 'Week 3', revenue: 19800, orders: 230, sellers: 141, products: 1240 },
      { label: 'Week 4', revenue: 19550, orders: 220, sellers: 142, products: 1240 },
    ]
  },
  Year: {
    metrics: { revenue: 342950, orders: 4210, sellers: 142, customers: 2840, products: 1240 },
    chart: [
      { label: 'Jan', revenue: 35000, orders: 480, sellers: 85, products: 1100 },
      { label: 'Feb', revenue: 42000, orders: 590, sellers: 96, products: 1130 },
      { label: 'Mar', revenue: 38000, orders: 510, sellers: 104, products: 1170 },
      { label: 'Apr', revenue: 56000, orders: 720, sellers: 115, products: 1200 },
      { label: 'May', revenue: 48000, orders: 680, sellers: 128, products: 1225 },
      { label: 'Jun', revenue: 75950, orders: 840, sellers: 142, products: 1240 },
    ]
  }
};

export const AdminAnalyticsPage: React.FC = () => {
  const adminState = useAppSelector((state) => state.admin);

  // Time range preset: Today | Week | Month | Year
  const [activeRange, setActiveRange] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Year');

  // Chart hover tracker
  const [hoveredIdx, setHoveredIdx] = useState<Record<string, number | null>>({
    revenue: null,
    orders: null,
    sellers: null,
    products: null,
  });

  // Extract selected metrics and charts list
  const currentData = RANGE_DATA[activeRange];
  
  // Dynamic totals syncing with active slice state for current Year
  const revenueTotal = activeRange === 'Year' ? adminState.totalRevenue : currentData.metrics.revenue;
  const ordersTotal = activeRange === 'Year' ? adminState.totalOrders : currentData.metrics.orders;
  const sellersTotal = activeRange === 'Year' ? adminState.totalSellers : currentData.metrics.sellers;
  const customersTotal = activeRange === 'Year' ? adminState.activeCustomers : currentData.metrics.customers;
  const productsTotal = activeRange === 'Year' ? adminState.totalProducts : currentData.metrics.products;

  // Chart Dimension constants
  const width = 500;
  const height = 200;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordinate Generator
  const getCoordinates = (points: number[], maxVal: number) => {
    const adjustedMax = maxVal === 0 ? 10 : maxVal * 1.15;
    return points.map((val, idx) => {
      const x = paddingLeft + (idx / (points.length - 1)) * chartWidth;
      const scale = val / adjustedMax;
      const y = paddingTop + chartHeight - scale * chartHeight;
      return { x, y, val };
    });
  };

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

  // Exporters logic
  const handleExport = (format: 'CSV' | 'Excel') => {
    const headers = ['Time Label', 'Revenue (USD)', 'Orders Count', 'Active Sellers', 'Total Products'];
    const rows = currentData.chart.map(p => [
      p.label,
      p.revenue.toString(),
      p.orders.toString(),
      p.sellers.toString(),
      p.products.toString()
    ]);

    let content = '';
    let filename = `admin-analytics-${activeRange.toLowerCase()}-${Date.now()}`;
    let mimeType = '';

    if (format === 'CSV') {
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      mimeType = 'text/csv;charset=utf-8;';
      filename += '.csv';
    } else {
      content = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
      mimeType = 'application/vnd.ms-excel;charset=utf-8;';
      filename += '.xls';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Revenue path
  const revenuePoints = currentData.chart.map((d) => d.revenue);
  const maxRevenue = Math.max(...revenuePoints, 0);
  const revenueCoords = getCoordinates(revenuePoints, maxRevenue);

  // 2. Orders path
  const ordersPoints = currentData.chart.map((d) => d.orders);
  const maxOrders = Math.max(...ordersPoints, 0);
  const ordersCoords = getCoordinates(ordersPoints, maxOrders);

  // 3. Sellers path
  const sellersPoints = currentData.chart.map((d) => d.sellers);
  const maxSellers = Math.max(...sellersPoints, 0);
  const sellersCoords = getCoordinates(sellersPoints, maxSellers);

  // 4. Products path
  const productsPoints = currentData.chart.map((d) => d.products);
  const maxProducts = Math.max(...productsPoints, 0);
  const productsCoords = getCoordinates(productsPoints, maxProducts);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <BarChart3 className="text-indigo-650" size={24} />
            <span>Platform Analytics Console</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Analyze gross business metrics, vendor growth streams, and inventory counts.
          </p>
        </div>

        {/* Range Filters */}
        <div className="flex bg-slate-50 border border-slate-200/50 p-1 rounded-xl self-start sm:self-center">
          {(['Today', 'Week', 'Month', 'Year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeRange === r
                  ? 'bg-white text-slate-800 shadow-3xs border border-slate-250/20'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Revenue */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3 text-indigo-600">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <DollarSign size={16} />
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight size={10} />
              +14%
            </span>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Revenue</span>
          <h3 className="text-base font-black text-slate-800 mt-1">${revenueTotal.toLocaleString()}</h3>
        </div>

        {/* Orders */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3 text-emerald-600">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ShoppingCart size={16} />
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight size={10} />
              +8%
            </span>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Orders</span>
          <h3 className="text-base font-black text-slate-800 mt-1">{ordersTotal.toLocaleString()}</h3>
        </div>

        {/* Sellers */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3 text-indigo-650">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users size={16} />
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight size={10} />
              +6%
            </span>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Active Sellers</span>
          <h3 className="text-base font-black text-slate-800 mt-1">{sellersTotal.toLocaleString()}</h3>
        </div>

        {/* Customers */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3 text-blue-600">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users size={16} />
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight size={10} />
              +11%
            </span>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Customers</span>
          <h3 className="text-base font-black text-slate-800 mt-1">{customersTotal.toLocaleString()}</h3>
        </div>

        {/* Products */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3 text-violet-600">
            <div className="p-2 bg-violet-50 rounded-lg">
              <Package size={16} />
            </div>
            <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">Stable</span>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Products</span>
          <h3 className="text-base font-black text-slate-800 mt-1">{productsTotal.toLocaleString()}</h3>
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-405 font-bold flex items-center gap-1.5">
          <Calendar size={14} className="text-indigo-650" />
          <span>Active filter reporting interval: <strong>{activeRange}</strong></span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200/50 cursor-pointer transition-colors"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200/50 cursor-pointer transition-colors"
          >
            <Download size={12} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Graphs Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue Trend */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Revenue Trend</span>
              <DollarSign size={14} className="text-indigo-650" />
            </div>
            <h4 className="text-base font-black text-slate-800">Sales Income Streams</h4>
          </div>

          <div className="mt-5 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="revenueGradAdmin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={paddingTop + r * chartHeight}
                  x2={width - paddingRight}
                  y2={paddingTop + r * chartHeight}
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
              ))}

              <path d={generateAreaPath(revenueCoords)} fill="url(#revenueGradAdmin)" />
              
              <path
                d={generateLinePath(revenueCoords)}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Hover targets */}
              {revenueCoords.map((pt, idx) => {
                const isHovered = hoveredIdx.revenue === idx;
                return (
                  <g key={idx}>
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
                        <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={paddingTop + chartHeight} stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx={pt.x} cy={pt.y} r="5.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Labels */}
              {currentData.chart.map((pt, idx) => (
                <text
                  key={idx}
                  x={paddingLeft + (idx / (currentData.chart.length - 1)) * chartWidth}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pt.label}
                </text>
              ))}
            </svg>

            {hoveredIdx.revenue !== null && (
              <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md">
                {currentData.chart[hoveredIdx.revenue].label}: ${currentData.chart[hoveredIdx.revenue].revenue.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Orders Trend */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Orders Volume Trend</span>
              <ShoppingCart size={14} className="text-emerald-600" />
            </div>
            <h4 className="text-base font-black text-slate-800">Checkout Quantities</h4>
          </div>

          <div className="mt-5 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={paddingTop + r * chartHeight}
                  x2={width - paddingRight}
                  y2={paddingTop + r * chartHeight}
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
              ))}

              {ordersCoords.map((pt, idx) => {
                const barWidth = Math.max(8, chartWidth / (ordersCoords.length * 2.2));
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
                      className="cursor-pointer transition-colors duration-150"
                      onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, orders: idx }))}
                      onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, orders: null }))}
                    />
                  </g>
                );
              })}

              {currentData.chart.map((pt, idx) => (
                <text
                  key={idx}
                  x={paddingLeft + (idx / (currentData.chart.length - 1)) * chartWidth}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pt.label}
                </text>
              ))}
            </svg>

            {hoveredIdx.orders !== null && (
              <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md">
                {currentData.chart[hoveredIdx.orders].label}: {currentData.chart[hoveredIdx.orders].orders} checkouts
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Seller Growth */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Merchant Growth</span>
              <Users size={14} className="text-blue-600" />
            </div>
            <h4 className="text-base font-black text-slate-800">Total Registered Stores</h4>
          </div>

          <div className="mt-5 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={paddingTop + r * chartHeight}
                  x2={width - paddingRight}
                  y2={paddingTop + r * chartHeight}
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
              ))}

              <path
                d={generateLinePath(sellersCoords)}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {sellersCoords.map((pt, idx) => {
                const isHovered = hoveredIdx.sellers === idx;
                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '5.5' : '3.5'}
                      fill={isHovered ? '#2563eb' : '#ffffff'}
                      stroke="#2563eb"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, sellers: idx }))}
                      onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, sellers: null }))}
                    />
                  </g>
                );
              })}

              {currentData.chart.map((pt, idx) => (
                <text
                  key={idx}
                  x={paddingLeft + (idx / (currentData.chart.length - 1)) * chartWidth}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pt.label}
                </text>
              ))}
            </svg>

            {hoveredIdx.sellers !== null && (
              <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md">
                {currentData.chart[hoveredIdx.sellers].label}: {currentData.chart[hoveredIdx.sellers].sellers} sellers
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Product Growth */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Catalog Growth</span>
              <Package size={14} className="text-violet-600" />
            </div>
            <h4 className="text-base font-black text-slate-800">Active Publications Count</h4>
          </div>

          <div className="mt-5 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                <line
                  key={i}
                  x1={paddingLeft}
                  y1={paddingTop + r * chartHeight}
                  x2={width - paddingRight}
                  y2={paddingTop + r * chartHeight}
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
              ))}

              <path
                d={generateLinePath(productsCoords)}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {productsCoords.map((pt, idx) => {
                const isHovered = hoveredIdx.products === idx;
                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '5.5' : '3.5'}
                      fill={isHovered ? '#7c3aed' : '#ffffff'}
                      stroke="#7c3aed"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(prev => ({ ...prev, products: idx }))}
                      onMouseLeave={() => setHoveredIdx(prev => ({ ...prev, products: null }))}
                    />
                  </g>
                );
              })}

              {currentData.chart.map((pt, idx) => (
                <text
                  key={idx}
                  x={paddingLeft + (idx / (currentData.chart.length - 1)) * chartWidth}
                  y={height - 5}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pt.label}
                </text>
              ))}
            </svg>

            {hoveredIdx.products !== null && (
              <div className="absolute top-2 left-[50%] -translate-x-[50%] bg-slate-900 text-white text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md">
                {currentData.chart[hoveredIdx.products].label}: {currentData.chart[hoveredIdx.products].products} products
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
