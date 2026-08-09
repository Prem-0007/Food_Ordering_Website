import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const statusPill = (status) => {
  const map = { pending: 'pill-muted', preparing: 'pill-success', out_for_delivery: 'pill-success', delivered: 'pill-success', cancelled: 'pill-danger' };
  return map[status] || 'pill-muted';
};
const statusLabel = (status) => (status ? status.replace(/_/g, ' ') : 'Unknown');
const NEXT_STATUS = { pending: 'preparing', preparing: 'out_for_delivery', out_for_delivery: 'delivered' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    const { data } = await api.get('/orders', { params });
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleAdvance = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await api.put(`/orders/${order._id}/status`, { status: next });
    load();
  };

  const handleCancel = async (id) => {
    await api.put(`/orders/${id}/status`, { status: 'cancelled' });
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">Order Management</h1>

      <div className="filter-bar glass">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state glass">No orders found.</div>
      ) : (
        <div className="reg-list">
          {orders.map((o, i) => (
            <Reveal key={o._id} delay={Math.min(i * 30, 300)}>
              <div className="record-item glass">
                <div className="record-header">
                  <h3>Order #{o._id.slice(-6).toUpperCase()} — {o.user?.name || 'Unknown user'}</h3>
                  <span className={`pill ${statusPill(o.status)}`}>{statusLabel(o.status)}</span>
                </div>
                <p className="course-meta">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Unknown date'} · {(o.paymentMethod || 'N/A').toUpperCase()}
                </p>
                <ul className="order-items-list">
                  {(o.items || []).map((it, idx) => <li key={idx}>{it.name} × {it.quantity}</li>)}
                </ul>
                <p className="course-meta">Deliver to: {o.deliveryAddress || 'N/A'}</p>
                <p className="fee-tag">Total: ₹{o.totalAmount ?? 0}</p>

                {!['delivered', 'cancelled'].includes(o.status) && (
                  <div className="owner-actions" style={{ marginTop: 10, marginLeft: 0 }}>
                    {NEXT_STATUS[o.status] && (
                      <button onClick={() => handleAdvance(o)}>Advance to {statusLabel(NEXT_STATUS[o.status])}</button>
                    )}
                    <button className="danger" onClick={() => handleCancel(o._id)}>Cancel</button>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default AdminOrders;
