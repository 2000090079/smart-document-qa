import { useState, useEffect } from 'react';
import StatCard from '../components/UI/StatCard';
import RevenueChart from '../components/Charts/RevenueChart';
import ActivityChart from '../components/Charts/ActivityChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import api from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/metrics/summary'),
      api.get('/api/metrics/revenue'),
      api.get('/api/metrics/activity'),
    ])
      .then(([s, r, a]) => {
        setSummary(s.data);
        setRevenue(r.data);
        setActivity(a.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your business.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={summary?.totalUsers ?? '—'}
          change={8.2}
          icon="👤"
          color="blue"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${(summary?.revenue ?? 0).toLocaleString()}`}
          change={12.5}
          icon="💰"
          color="green"
        />
        <StatCard
          label="Active Sessions"
          value={summary?.activeSessions ?? '—'}
          change={-3.1}
          icon="📊"
          color="purple"
        />
        <StatCard
          label="Growth Rate"
          value={`${summary?.growthRate ?? 0}%`}
          change={2.4}
          icon="📈"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenue} />
        <ActivityChart data={activity} />
      </div>
    </div>
  );
}
