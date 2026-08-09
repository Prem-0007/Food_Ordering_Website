import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Welcome, {user.name}</h1>

      <div className="stat-grid">
        <div className="stat-card glass"><span className="stat-label">Total Orders</span><span className="stat-value">{data.totalOrders}</span></div>
        <div className="stat-card glass"><span className="stat-label">Pending Orders</span><span className="stat-value">{data.pendingOrders}</span></div>
        <div className="stat-card glass"><span className="stat-label">Menu Items</span><span className="stat-value">{data.totalFoodItems}</span></div>
        <div className="stat-card glass"><span className="stat-label">Total Customers</span><span className="stat-value">{data.totalCustomers}</span></div>
      </div>

      <div className="panel glass">
        <h2>Revenue</h2>
        <p className="stat-value" style={{ fontSize: 32 }}>₹{data.totalRevenue}</p>
        <p className="course-meta">Total revenue from all non-cancelled orders</p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
