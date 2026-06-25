import React from 'react';
import { Calendar, Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';

export type TimeRangePreset = 'Today' | 'Week' | 'Month' | 'Year' | 'Custom';

interface AnalyticsFiltersProps {
  timeRange: TimeRangePreset;
  startDate: string;
  endDate: string;
  onTimeRangeChange: (preset: TimeRangePreset) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  timeRange,
  startDate,
  endDate,
  onTimeRangeChange,
  onStartDateChange,
  onEndDateChange,
  onExportCSV,
  onExportExcel,
  onExportPDF,
}) => {
  const presets: { label: string; value: TimeRangePreset }[] = [
    { label: 'Today', value: 'Today' },
    { label: 'This Week', value: 'Week' },
    { label: 'This Month', value: 'Month' },
    { label: 'This Year', value: 'Year' },
    { label: 'Custom Range', value: 'Custom' },
  ];

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-4 text-left print:hidden">
      
      {/* Time presets & date inputs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
        
        {/* Preset selectors */}
        <div className="flex bg-slate-150/45 p-1 rounded-xl gap-1 shrink-0">
          {presets.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTimeRangeChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                timeRange === opt.value
                  ? 'bg-white text-indigo-650 shadow-3xs'
                  : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom Range Date Pickers */}
        {timeRange === 'Custom' && (
          <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
            <div className="flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-2 py-1 gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-hidden font-mono"
              />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">to</span>
            <div className="flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-2 py-1 gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-hidden font-mono"
              />
            </div>
          </div>
        )}

      </div>

      {/* Export operations */}
      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
        <span className="text-[10px] font-black uppercase text-slate-450 mr-1 flex items-center gap-1">
          <Download size={13} />
          <span>Export:</span>
        </span>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          title="Print or Export PDF"
        >
          <Printer size={13} className="text-rose-500" />
          <span>PDF</span>
        </button>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          title="Export CSV"
        >
          <FileText size={13} className="text-indigo-650" />
          <span>CSV</span>
        </button>
        <button
          onClick={onExportExcel}
          className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          title="Export Excel"
        >
          <FileSpreadsheet size={13} className="text-emerald-600" />
          <span>Excel</span>
        </button>
      </div>

    </div>
  );
};

export default AnalyticsFilters;
