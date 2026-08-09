import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const PIE_COLORS = ['#f97316', '#dc2626', '#059669', '#f59e0b', '#84cc16'];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/reports').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  const dailyData = data.dailyOrders.map((d) => ({ day: d._id.slice(5), orders: d.count, revenue: d.revenue }));
  const topSellingData = data.topSelling.map((d) => ({ name: d._id, qty: d.quantitySold }));
  const categoryData = data.categoryRevenue.map((d) => ({ name: d._id, value: d.revenue }));
  const statusData = data.statusBreakdown.map((d) => ({ name: d._id.replace(/_/g, ' '), value: d.count }));

  return (
    <Layout>
      <h1 className="page-title">Reports & Analytics</h1>

      <Reveal>
        <div className="panel glass">
          <h2>Daily Orders (Last 7 Days)</h2>
          {dailyData.length === 0 ? <div className="empty-state">No order data yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="panel glass">
          <h2>Daily Revenue</h2>
          {dailyData.length === 0 ? <div className="empty-state">No revenue data yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="panel glass">
          <h2>Top Selling Dishes</h2>
          {topSellingData.length === 0 ? <div className="empty-state">No sales data yet.</div> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topSellingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" stroke="var(--text-secondary)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={110} />
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Bar dataKey="qty" fill="#dc2626" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div className="panel glass">
          <h2>Revenue by Category</h2>
          {categoryData.length === 0 ? <div className="empty-state">No category data yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={300}>
        <div className="panel glass">
          <h2>Order Status Breakdown</h2>
          {statusData.length === 0 ? <div className="empty-state">No orders yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>
    </Layout>
  );
};

export default Reports;
