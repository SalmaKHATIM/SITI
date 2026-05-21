'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Package,
  AlertCircle,
  Leaf,
  Clock,
  CheckCircle2,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeBatches: 0,
    lowStockAlerts: 0,
    qualityScore: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch sample data
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      const { data: batches } = await supabase
        .from('batches')
        .select('id')
        .eq('status', 'in_production')
        .limit(1);

      const { data: alerts } = await supabase
        .from('stock_alerts')
        .select('id')
        .eq('resolved', false)
        .limit(1);

      setStats({
        totalProducts: products?.length || 12,
        activeBatches: batches?.length || 8,
        lowStockAlerts: alerts?.length || 3,
        qualityScore: 94,
      });
    } catch (error) {
      console.error('[STTIS] Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { month: 'Jan', sales: 4000, forecast: 4200 },
    { month: 'Feb', sales: 3000, forecast: 3500 },
    { month: 'Mar', sales: 2000, forecast: 2800 },
    { month: 'Apr', sales: 2780, forecast: 3200 },
    { month: 'May', sales: 1890, forecast: 2500 },
    { month: 'Jun', sales: 2390, forecast: 2900 },
  ];

  const stockData = [
    { name: 'Premium Green', value: 45 },
    { name: 'Black Tea', value: 25 },
    { name: 'White Tea', value: 18 },
    { name: 'Oolong', value: 12 },
  ];

  const COLORS = ['#10b981', '#5cb85c', '#6b8e6f', '#7fb3a8'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="backdrop-blur-lg bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-white/20 rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-primary">{user?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tea supply chain today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-2">Total Products</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-accent" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              8%
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-2">Active Batches</p>
          <p className="text-3xl font-bold text-foreground">{stats.activeBatches}</p>
        </div>

        {/* Stat Card 3 */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
              <ArrowDownRight className="w-4 h-4" />
              3
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-2">Stock Alerts</p>
          <p className="text-3xl font-bold text-foreground">{stats.lowStockAlerts}</p>
        </div>

        {/* Stat Card 4 */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              5%
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-2">Quality Score</p>
          <p className="text-3xl font-bold text-foreground">{stats.qualityScore}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Forecast Chart */}
        <div className="lg:col-span-2 backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Sales Forecast (12 Months)
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View All
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="forecast" stroke="#5cb85c" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Distribution */}
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Stock Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stockData} cx="50%" cy="50%" labelLine={false} label={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} outerRadius={80} fill="#8884d8" dataKey="value">
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Batch #B{1000 + item} completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
