import React, { useState } from 'react';
import { BarChart3, TrendingUp, Percent } from 'lucide-react';
import type { WalletStats } from '../../../../../shared/types';

interface RevenueChartsProps {
  dailyRevenue: WalletStats['dailyRevenue'];
  monthlyRevenue: WalletStats['monthlyRevenue'];
  productRevenue: WalletStats['productRevenue'];
}

export const RevenueCharts: React.FC<RevenueChartsProps> = ({
  dailyRevenue = [],
  monthlyRevenue = [],
  productRevenue = [],
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly'>('daily');

  // Compute maximum values to scale custom bar heights proportionally
  const dailyMax = Math.max(...dailyRevenue.map((d) => d.amount), 1);
  const monthlyMax = Math.max(...monthlyRevenue.map((m) => m.amount), 1);

  // For product splits, get max amount to draw progress bars
  const overallProductSalesSum = productRevenue.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left select-none">
      
      {/* 1. Main Revenue Charts (Left side - 2 cols) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs lg:col-span-2 flex flex-col justify-between space-y-6">
        
        {/* Chart Header */}
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
              <BarChart3 size={15} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider leading-none">Earnings Analytics</h3>
              <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Visual representation of store performance</span>
            </div>
          </div>

          {/* Timeframe Toggles */}
          <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                timeframe === 'daily'
                  ? 'bg-white text-indigo-650 shadow-3xs'
                  : 'text-slate-450 hover:text-slate-800'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-white text-indigo-650 shadow-3xs'
                  : 'text-slate-450 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Custom CSS Bar Chart */}
        <div className="flex-1 flex flex-col justify-end min-h-[200px] pt-4">
          {timeframe === 'daily' ? (
            /* Daily Bar Chart layout */
            <div className="grid grid-cols-7 gap-2.5 items-end h-[160px] pb-1 border-b border-slate-100">
              {dailyRevenue.map((day) => {
                const heightPercentage = Math.round((day.amount / dailyMax) * 100);
                return (
                  <div key={day.date} className="flex flex-col items-center group relative h-full justify-end cursor-pointer">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-md z-10 whitespace-nowrap">
                      ${day.amount.toFixed(2)}
                    </div>
                    
                    {/* Bar Pillar */}
                    <div 
                      style={{ height: `${Math.max(heightPercentage, 8)}%` }}
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-3xs group-hover:scale-x-105"
                    />

                    {/* Day label */}
                    <span className="text-[9px] font-black text-slate-400 uppercase mt-2 select-none group-hover:text-slate-900 transition-colors">
                      {day.date}
                    </span>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Monthly Bar Chart layout */
            <div className="grid grid-cols-6 gap-3 md:gap-4 items-end h-[160px] pb-1 border-b border-slate-100">
              {monthlyRevenue.map((mon) => {
                const heightPercentage = Math.round((mon.amount / monthlyMax) * 100);
                return (
                  <div key={mon.month} className="flex flex-col items-center group relative h-full justify-end cursor-pointer">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-md z-10 whitespace-nowrap">
                      ${mon.amount.toFixed(2)}
                    </div>
                    
                    {/* Bar Pillar */}
                    <div 
                      style={{ height: `${Math.max(heightPercentage, 8)}%` }}
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-650 rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 shadow-3xs group-hover:scale-x-105"
                    />

                    {/* Month Label */}
                    <span className="text-[9px] font-black text-slate-400 uppercase mt-2 select-none group-hover:text-slate-900 transition-colors">
                      {mon.month}
                    </span>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Graph Legend */}
        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 border-t border-slate-50 pt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
            <span>Daily Sales Volume</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-purple-600 rounded-full" />
            <span>Monthly Payout Ledger</span>
          </div>
          <span className="ml-auto text-slate-400">Values are shown in USD ($)</span>
        </div>

      </div>

      {/* 2. Top Product Splits (Right side - 1 col) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between space-y-5">
        
        {/* Split Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-650 flex items-center justify-center">
            <TrendingUp size={15} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider leading-none">Product Revenue Splits</h3>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Total earnings share by product</span>
          </div>
        </div>

        {/* Progress Splits List */}
        <div className="space-y-4 py-2 flex-grow overflow-y-auto">
          {productRevenue.map((product) => {
            const percentage = overallProductSalesSum > 0 
              ? Math.round((product.amount / overallProductSalesSum) * 100) 
              : 0;

            return (
              <div key={product.productName} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                  <span className="truncate max-w-[170px] text-slate-800 font-extrabold">{product.productName}</span>
                  <span className="text-slate-900 font-black shrink-0">
                    ${product.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                {/* Visual Progress bar */}
                <div className="relative w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-650 rounded-full transition-all duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[8px] font-bold text-slate-400">
                  <span>{product.salesCount} units sold</span>
                  <span>{percentage}% share</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small split summary */}
        <div className="border-t border-slate-100 pt-3 text-[9px] text-slate-400 font-semibold flex items-center gap-1.5 justify-center">
          <Percent size={11} className="text-purple-600" />
          <span>Shares indicate net store performance payouts.</span>
        </div>

      </div>

    </div>
  );
};

export default RevenueCharts;
