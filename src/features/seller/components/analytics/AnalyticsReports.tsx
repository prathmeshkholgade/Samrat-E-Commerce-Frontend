import React, { useState } from 'react';
import { Package, Folder, TrendingUp, Star, ArrowDown, ArrowUp } from 'lucide-react';

interface ProductRow {
  name: string;
  sku: string;
  category: string;
  salesQty: number;
  revenue: number;
  conversionRate: number;
  rating: number;
}

interface CategoryRow {
  name: string;
  itemsCount: number;
  ordersCount: number;
  revenue: number;
  growthRate: number;
}

interface SalesTrendRow {
  period: string;
  avgOrderValue: number;
  conversionRate: number;
  abandonmentRate: number;
  traffic: number;
  grossSales: number;
}

const mockProducts: ProductRow[] = [
  { name: 'Premium Wireless Headphones (Grey)', sku: 'PRM-HD-GRY', category: 'Electronics', salesQty: 245, revenue: 36725.00, conversionRate: 3.8, rating: 4.8 },
  { name: 'Ergonomic Office Chair (Mesh)', sku: 'ERG-CH-MSH', category: 'Home & Kitchen', salesQty: 180, revenue: 32400.00, conversionRate: 2.9, rating: 4.5 },
  { name: 'Smart Fitness Band (Black)', sku: 'SMRT-FB-BLK', category: 'Electronics', salesQty: 320, revenue: 25600.00, conversionRate: 4.2, rating: 4.3 },
  { name: 'Cold Pressed Coconut Oil (1L)', sku: 'COLD-CO-1L', category: 'Grocery', salesQty: 450, revenue: 9000.00, conversionRate: 5.1, rating: 4.7 },
  { name: 'Organic Green Tea (50 bags)', sku: 'ORG-GT-50B', category: 'Grocery', salesQty: 380, revenue: 5700.00, conversionRate: 4.8, rating: 4.6 },
];

const mockCategories: CategoryRow[] = [
  { name: 'Electronics', itemsCount: 15, ordersCount: 565, revenue: 62325.00, growthRate: 14.5 },
  { name: 'Home & Kitchen', itemsCount: 22, ordersCount: 310, revenue: 45600.00, growthRate: -2.3 },
  { name: 'Grocery', itemsCount: 45, ordersCount: 830, revenue: 14700.00, growthRate: 22.1 },
  { name: 'Beauty & Skincare', itemsCount: 18, ordersCount: 190, revenue: 9800.00, growthRate: 8.4 },
  { name: 'Sports & Fitness', itemsCount: 12, ordersCount: 120, revenue: 7600.00, growthRate: 12.0 },
];

const mockTrends: SalesTrendRow[] = [
  { period: 'Week 1', avgOrderValue: 145.20, conversionRate: 3.2, abandonmentRate: 68.4, traffic: 12400, grossSales: 12750.00 },
  { period: 'Week 2', avgOrderValue: 139.80, conversionRate: 3.5, abandonmentRate: 65.1, traffic: 13500, grossSales: 15100.00 },
  { period: 'Week 3', avgOrderValue: 148.50, conversionRate: 3.4, abandonmentRate: 66.8, traffic: 12800, grossSales: 14200.00 },
  { period: 'Week 4', avgOrderValue: 152.00, conversionRate: 3.9, abandonmentRate: 62.0, traffic: 14800, grossSales: 18500.00 },
  { period: 'Week 5 (Current)', avgOrderValue: 155.40, conversionRate: 4.1, abandonmentRate: 60.5, traffic: 16200, grossSales: 21500.00 },
];

export const AnalyticsReports: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<'product' | 'category' | 'trends'>('product');

  const reportTabs = [
    { id: 'product', label: 'Product Performance', icon: <Package size={14} /> },
    { id: 'category', label: 'Category Performance', icon: <Folder size={14} /> },
    { id: 'trends', label: 'Sales Trends Ledger', icon: <TrendingUp size={14} /> },
  ] as const;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs text-left space-y-5">
      
      {/* Tab controls */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeReportTab === tab.id
                  ? 'bg-white text-indigo-650 shadow-3xs'
                  : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Audit Registry</span>
      </div>

      {/* Render selected table */}
      <div className="overflow-x-auto">
        {activeReportTab === 'product' && (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Units Sold</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Conv. Rate</th>
                <th className="py-3 px-4 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
              {mockProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-900 font-extrabold max-w-[280px] truncate">{p.name}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] uppercase text-slate-500">{p.sku}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/40 text-[9px] font-bold text-slate-650 uppercase tracking-wider">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-850 font-extrabold">{p.salesQty.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-slate-900 font-extrabold">${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3.5 px-4 text-right text-indigo-650 font-black">{p.conversionRate}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="flex items-center justify-end gap-1 font-mono text-amber-600 font-black">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{p.rating}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeReportTab === 'category' && (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4 text-right">Registered Items</th>
                <th className="py-3 px-4 text-right">Orders Volume</th>
                <th className="py-3 px-4 text-right">Gross Revenue</th>
                <th className="py-3 px-4 text-right">Growth Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
              {mockCategories.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-900 font-extrabold">{c.name}</td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-extrabold">{c.itemsCount}</td>
                  <td className="py-3.5 px-4 text-right text-slate-850">{c.ordersCount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-slate-900 font-extrabold">${c.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      c.growthRate >= 0 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                    }`}>
                      {c.growthRate >= 0 ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
                      <span>{Math.abs(c.growthRate)}%</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeReportTab === 'trends' && (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-right">Avg Order Value</th>
                <th className="py-3 px-4 text-right">Conv. Rate</th>
                <th className="py-3 px-4 text-right">Cart Abandonment</th>
                <th className="py-3 px-4 text-right">Weekly Traffic</th>
                <th className="py-3 px-4 text-right">Gross Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
              {mockTrends.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-900 font-extrabold">{t.period}</td>
                  <td className="py-3.5 px-4 text-right text-slate-850">${t.avgOrderValue.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right text-indigo-650 font-black">{t.conversionRate}%</td>
                  <td className="py-3.5 px-4 text-right text-rose-600">{t.abandonmentRate}%</td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-mono text-[10px]">{t.traffic.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-slate-900 font-extrabold">${t.grossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AnalyticsReports;
