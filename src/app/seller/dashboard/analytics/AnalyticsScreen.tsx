import React, { useState } from 'react';
import { BarChart2, Compass } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../../features/seller/components/analytics/AnalyticsExporter';
import { AnalyticsFilters, type TimeRangePreset } from '../../../../features/seller/components/analytics/AnalyticsFilters';
import { AnalyticsCharts, type ChartDataPoint } from '../../../../features/seller/components/analytics/AnalyticsCharts';
import { AnalyticsReports } from '../../../../features/seller/components/analytics/AnalyticsReports';

// 1. Mock Data Sets for Different Time Ranges
const dataToday: ChartDataPoint[] = [
  { label: '08:00', revenue: 120, sales: 5, orders: 4, newCustomers: 2, returningCustomers: 3 },
  { label: '10:00', revenue: 240, sales: 8, orders: 7, newCustomers: 3, returningCustomers: 5 },
  { label: '12:00', revenue: 450, sales: 15, orders: 12, newCustomers: 8, returningCustomers: 7 },
  { label: '14:00', revenue: 320, sales: 10, orders: 8, newCustomers: 4, returningCustomers: 6 },
  { label: '16:00', revenue: 580, sales: 20, orders: 16, newCustomers: 10, returningCustomers: 10 },
  { label: '18:00', revenue: 640, sales: 22, orders: 19, newCustomers: 12, returningCustomers: 10 },
];

const dataWeek: ChartDataPoint[] = [
  { label: 'Mon', revenue: 1200, sales: 40, orders: 30, newCustomers: 15, returningCustomers: 25 },
  { label: 'Tue', revenue: 1450, sales: 50, orders: 42, newCustomers: 20, returningCustomers: 30 },
  { label: 'Wed', revenue: 1300, sales: 45, orders: 38, newCustomers: 18, returningCustomers: 27 },
  { label: 'Thu', revenue: 1800, sales: 62, orders: 55, newCustomers: 25, returningCustomers: 37 },
  { label: 'Fri', revenue: 2200, sales: 75, orders: 68, newCustomers: 35, returningCustomers: 40 },
  { label: 'Sat', revenue: 2800, sales: 95, orders: 85, newCustomers: 45, returningCustomers: 50 },
];

const dataMonth: ChartDataPoint[] = [
  { label: 'Week 1', revenue: 8400, sales: 280, orders: 240, newCustomers: 110, returningCustomers: 170 },
  { label: 'Week 2', revenue: 9800, sales: 320, orders: 290, newCustomers: 130, returningCustomers: 190 },
  { label: 'Week 3', revenue: 10200, sales: 340, orders: 310, newCustomers: 140, returningCustomers: 200 },
  { label: 'Week 4', revenue: 11500, sales: 380, orders: 350, newCustomers: 170, returningCustomers: 210 },
  { label: 'Week 5', revenue: 12400, sales: 410, orders: 380, newCustomers: 180, returningCustomers: 230 },
  { label: 'Week 6', revenue: 13100, sales: 440, orders: 410, newCustomers: 200, returningCustomers: 240 },
];

const dataYear: ChartDataPoint[] = [
  { label: 'Jan-Feb', revenue: 32000, sales: 1100, orders: 980, newCustomers: 450, returningCustomers: 650 },
  { label: 'Mar-Apr', revenue: 38500, sales: 1300, orders: 1150, newCustomers: 520, returningCustomers: 780 },
  { label: 'May-Jun', revenue: 45000, sales: 1550, orders: 1380, newCustomers: 680, returningCustomers: 870 },
  { label: 'Jul-Aug', revenue: 49800, sales: 1700, orders: 1520, newCustomers: 720, returningCustomers: 980 },
  { label: 'Sep-Oct', revenue: 54000, sales: 1900, orders: 1680, newCustomers: 800, returningCustomers: 1100 },
  { label: 'Nov-Dec', revenue: 68000, sales: 2400, orders: 2100, newCustomers: 1100, returningCustomers: 1300 },
];

export const AnalyticsScreen: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRangePreset>('Month');
  const [startDate, setStartDate] = useState<string>('2026-06-01');
  const [endDate, setEndDate] = useState<string>('2026-06-25');

  // Select chart data based on filters
  const getActiveData = (): ChartDataPoint[] => {
    switch (timeRange) {
      case 'Today':
        return dataToday;
      case 'Week':
        return dataWeek;
      case 'Month':
        return dataMonth;
      case 'Year':
        return dataYear;
      case 'Custom':
        // Generate pseudo-custom points based on dates
        return dataMonth;
      default:
        return dataMonth;
    }
  };

  const activeData = getActiveData();

  // Export handlers
  const handleExportCSV = () => {
    const headers = ['Period/Interval', 'Revenue ($)', 'Sales Volume (units)', 'Orders Traffic', 'New Customers', 'Returning Customers'];
    const rows = activeData.map((d) => [
      d.label,
      d.revenue,
      d.sales,
      d.orders,
      d.newCustomers,
      d.returningCustomers,
    ]);
    exportToCSV(headers, rows, `Seller_Analytics_Report_${timeRange}`);
  };

  const handleExportExcel = () => {
    const headers = ['Period/Interval', 'Revenue ($)', 'Sales Volume (units)', 'Orders Traffic', 'New Customers', 'Returning Customers'];
    const rows = activeData.map((d) => [
      d.label,
      d.revenue,
      d.sales,
      d.orders,
      d.newCustomers,
      d.returningCustomers,
    ]);
    exportToExcel(headers, rows, `Seller_Analytics_Report_${timeRange}`);
  };

  const handleExportPDF = () => {
    exportToPDF();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <BarChart2 className="text-indigo-650" size={24} />
            <span>Store Advanced Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit cross-channel metrics, gross transaction volumes, conversion ratios, and product/department margins.</p>
        </div>
        <div className="text-left sm:text-right hidden sm:block">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Active Period Range</span>
          <span className="text-xs font-extrabold text-slate-800 uppercase font-mono">
            {timeRange === 'Custom' ? `${startDate} to ${endDate}` : `Preset: ${timeRange}`}
          </span>
        </div>
      </div>

      {/* Time filters & exports */}
      <AnalyticsFilters
        timeRange={timeRange}
        startDate={startDate}
        endDate={endDate}
        onTimeRangeChange={setTimeRange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* SVG Charts Row */}
      <AnalyticsCharts data={activeData} />

      {/* Reports Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 px-1">
          <Compass size={16} className="text-indigo-650" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Advanced Tabular Audit Ledgers</h4>
        </div>
        <AnalyticsReports />
      </div>

    </div>
  );
};

export default AnalyticsScreen;
