import React from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Star, 
  AlertTriangle 
} from 'lucide-react';
import { useAppSelector } from '../../../store';

// Widgets
import DashboardCard from '../../../features/seller/components/dashboard/DashboardCard';
import DashboardChart from '../../../features/seller/components/dashboard/DashboardChart';
import RecentOrdersTable from '../../../features/seller/components/dashboard/RecentOrdersTable';
import TopProductsWidget from '../../../features/seller/components/dashboard/TopProductsWidget';
import LowStockWidget from '../../../features/seller/components/dashboard/LowStockWidget';
import ReviewWidget from '../../../features/seller/components/dashboard/ReviewWidget';
import QuickActions from '../../../features/seller/components/dashboard/QuickActions';

export const DashboardHome: React.FC = () => {
  // Redux dashboard state selector
  const { metrics, recentOrders, topProducts, lowStock, recentReviews } = useAppSelector(
    (state) => state.dashboard
  );

  // Map Metric ID to Lucide Icon
  const getMetricIcon = (id: string) => {
    switch (id) {
      case 'total-products':
        return <ShoppingBag size={18} />;
      case 'total-orders':
        return <TrendingUp size={18} />;
      case 'pending-orders':
        return <Clock size={18} />;
      case 'delivered-orders':
        return <CheckCircle2 size={18} />;
      case 'total-revenue':
        return <DollarSign size={18} />;
      case 'monthly-revenue':
        return <DollarSign size={18} />;
      case 'store-rating':
        return <Star size={18} />;
      case 'low-stock':
        return <AlertTriangle size={18} />;
      default:
        return <ShoppingBag size={18} />;
    }
  };

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="space-y-6 text-left">
      
      {/* Greetings block */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
            Welcome back, <span className="text-purple-650">Samrat Enterprises</span>!
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Here is a comprehensive summary of your vendor store operations today.</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Today's Date</span>
          <span className="text-xs font-extrabold text-slate-800">{formattedDate}</span>
        </div>
      </div>

      {/* Analytics Card Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <DashboardCard 
            key={metric.id} 
            metric={metric} 
            icon={getMetricIcon(metric.id)} 
          />
        ))}
      </div>

      {/* Main Charts & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Orders Table & Low Stock Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>
        <div>
          <LowStockWidget items={lowStock} />
        </div>
      </div>

      {/* Top Products & Customer Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <TopProductsWidget products={topProducts} />
        </div>
        <div>
          <ReviewWidget reviews={recentReviews} />
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
