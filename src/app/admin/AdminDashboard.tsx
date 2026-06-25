import React from 'react';
import { useAppSelector } from '../../store';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  ShoppingBag, 
  ClipboardList, 
  ShoppingCart, 
  DollarSign, 
  UsersRound,
  LayoutDashboard
} from 'lucide-react';

// Components
import MetricCard from '../../features/admin/components/MetricCard';
import AdminCharts from '../../features/admin/components/AdminCharts';
import PendingApprovalsWidget from '../../features/admin/components/PendingApprovalsWidget';
import RecentSellersWidget from '../../features/admin/components/RecentSellersWidget';
import RecentOrdersWidget from '../../features/admin/components/RecentOrdersWidget';
import QuickActionsWidget from '../../features/admin/components/QuickActionsWidget';

export const AdminDashboard: React.FC = () => {
  const adminState = useAppSelector((state) => state.admin);

  const handleScrollToModeration = (_tab: 'sellers' | 'products') => {
    const el = document.getElementById('moderation-queue-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const metrics = [
    {
      label: 'Total Sellers',
      value: adminState.totalSellers,
      icon: <Users size={18} className="text-indigo-600" />,
      trend: { value: '+14% MoM', isPositive: true },
      subtext: 'Registered vendors',
    },
    {
      label: 'Active Sellers',
      value: adminState.activeSellers,
      icon: <ShieldCheck size={18} className="text-emerald-600" />,
      trend: { value: '+9%', isPositive: true },
      subtext: 'Approved & active',
    },
    {
      label: 'Pending Approvals',
      value: adminState.pendingSellers,
      icon: <UserCheck size={18} className="text-amber-600" />,
      trend: { value: 'Urgent', isPositive: false },
      subtext: 'Awaiting moderation',
    },
    {
      label: 'Total Products',
      value: adminState.totalProducts,
      icon: <ShoppingBag size={18} className="text-indigo-650" />,
      trend: { value: '+220 new', isPositive: true },
      subtext: 'Active catalog items',
    },
    {
      label: 'Pending Products',
      value: adminState.pendingProducts,
      icon: <ClipboardList size={18} className="text-rose-600" />,
      trend: { value: 'High priority', isPositive: false },
      subtext: 'Awaiting content audit',
    },
    {
      label: 'Total Orders',
      value: adminState.totalOrders,
      icon: <ShoppingCart size={18} className="text-emerald-700" />,
      trend: { value: '+18% MoM', isPositive: true },
      subtext: 'Platform checkouts',
    },
    {
      label: 'Total Revenue',
      value: `$${adminState.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign size={18} className="text-indigo-600" />,
      trend: { value: '+28% growth', isPositive: true },
      subtext: 'Gross merchandise volume',
    },
    {
      label: 'Active Customers',
      value: adminState.activeCustomers,
      icon: <UsersRound size={18} className="text-indigo-650" />,
      trend: { value: '+5.4% activity', isPositive: true },
      subtext: 'Monthly active buyers',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Title Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <LayoutDashboard className="text-indigo-650" size={24} />
            <span>Platform Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            System overview and business statistics for the multi-vendor marketplace.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-400 font-mono">
          Last updated: Just now
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <MetricCard
            key={idx}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            subtext={metric.subtext}
          />
        ))}
      </div>

      {/* Charts Visualization Panel */}
      <AdminCharts />

      {/* Moderation Queue & Action Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="moderation-queue-container">
        <div className="lg:col-span-2">
          <PendingApprovalsWidget />
        </div>
        <div className="lg:col-span-1">
          <QuickActionsWidget onScrollToModeration={handleScrollToModeration} />
        </div>
      </div>

      {/* Recent Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSellersWidget />
        <RecentOrdersWidget />
      </div>

    </div>
  );
};

export default AdminDashboard;
