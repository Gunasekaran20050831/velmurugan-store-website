import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TrendingUp, Package, Users, Activity, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ProductSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';

export default function AdminOverview() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [distributionData, setDistributionData] = useState({ payments: [], deliveries: [] });
  const [error, setError] = useState('');

  // Fetch Dashboard Analytics Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('vstore_token');
        if (!token) throw new Error('No admin token found.');
        
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Stats
        const statsRes = await fetch('/api/admin/dashboard-stats', { headers });
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsJson = await statsRes.json();
        
        // 2. Fetch Chart Data
        const chartRes = await fetch('/api/admin/revenue-chart', { headers });
        if (!chartRes.ok) throw new Error('Failed to fetch chart data');
        const chartJson = await chartRes.json();

        // 3. Fetch Distribution Data
        const distRes = await fetch('/api/admin/analytics/distribution', { headers });
        if (!distRes.ok) throw new Error('Failed to fetch distribution data');
        const distJson = await distRes.json();

        setStats(statsJson);
        setRevenueData(chartJson.chart_data || []);
        setDistributionData(distJson);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load business intelligence dashboard. Check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <EmptyState 
        icon={Activity} 
        title="Dashboard Error" 
        message={error} 
        actionLabel="Retry Connection" 
        onAction={() => window.location.reload()} 
      />
    );
  }

  const PIE_COLORS = ['#0A235C', '#D4AF37', '#2A4B8C', '#AA7C11'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
           Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          <>
            <div className="glass-card p-5 rounded-3xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Today's Revenue</span>
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-primary mt-3">₹{stats.today_revenue.toLocaleString()}</h3>
              <p className="text-[10px] text-muted font-semibold mt-1">Total revenue collected today</p>
            </div>

            <div className="glass-card p-5 rounded-3xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Today's Orders</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-primary mt-3">{stats.today_orders}</h3>
              <p className="text-[10px] text-muted font-semibold mt-1">Orders placed today</p>
            </div>

            <div className="glass-card p-5 rounded-3xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Customers</span>
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-primary mt-3">{stats.total_customers}</h3>
              <p className="text-[10px] text-muted font-semibold mt-1">Registered users</p>
            </div>

            <div className="glass-card p-5 rounded-3xl">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Avg Order Value</span>
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-primary mt-3">₹{Math.round(stats.aov).toLocaleString()}</h3>
              <p className="text-[10px] text-muted font-semibold mt-1">Across all historical orders</p>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-extrabold text-primary font-sans">30-Day Revenue Trend</h3>
          <div className="h-64 w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A235C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0A235C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="order_date" 
                    tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return `${date.getDate()}/${date.getMonth()+1}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                    labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="daily_revenue" stroke="#0A235C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted font-bold">
                No revenue data in the last 30 days.
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="glass-card p-6 rounded-3xl space-y-4 flex flex-col">
          <h3 className="text-sm font-extrabold text-primary font-sans">Payment Methods</h3>
          
          <div className="flex-1 w-full min-h-[200px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : distributionData.payments.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData.payments}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="payment_method"
                  >
                    {distributionData.payments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted font-bold">
                No payment data available.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sub-KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? null : (
          <>
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-muted uppercase">Pending Fulfillment</h4>
                <p className="text-xl font-extrabold text-orange-500 mt-1">{stats.pending_orders} Orders</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-muted uppercase">Total Catalog Size</h4>
                <p className="text-xl font-extrabold text-primary mt-1">{stats.total_products} Active Items</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
