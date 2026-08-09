import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const statusPill = (status) => {
  const map = { pending: 'pill-muted', preparing: 'pill-success', out_for_delivery: 'pill-success', delivered: 'pill-success', cancelled: 'pill-danger' };
  return map[status] || 'pill-muted';
};
const statusLabel = (status) => status.replace(/_/g, ' ');

const ORDER_STEPS = ['pending', 'preparing', 'out_for_delivery', 'delivered'];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/orders/mine');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    await api.put(`/orders/${id}/cancel`);
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">My Orders</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state glass">No orders yet.</div>
      ) : (
        <div className="reg-list">
          {orders.map((o, i) => (
            <Reveal key={o._id} delay={i * 40}>
              <div className="record-item glass">
                <div className="record-header">
                  <h3>Order #{o._id.slice(-6).toUpperCase()}</h3>
                  <span className={`pill ${statusPill(o.status)}`}>{statusLabel(o.status)}</span>
                </div>
                <p className="course-meta">{new Date(o.createdAt).toLocaleString()}</p>

                {o.status !== 'cancelled' && (
                  <div className="status-track">
                    {ORDER_STEPS.map((step, idx) => {
                      const currentIdx = ORDER_STEPS.indexOf(o.status);
                      const done = idx <= currentIdx;
                      return (
                        <div key={step} className={`status-step ${done ? 'done' : ''}`}>
                          <span className="status-dot" />
                          <span className="status-label">{statusLabel(step)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <ul className="order-items-list">
                  {o.items.map((it, idx) => (
                    <li key={idx}>{it.name} × {it.quantity} — ₹{it.price * it.quantity}</li>
                  ))}
                </ul>

                <p className="course-meta">Delivery to: {o.deliveryAddress}</p>
                {o.discount > 0 && <p className="course-meta">Coupon {o.couponCode} applied: -₹{o.discount}</p>}
                <p className="fee-tag">Total: ₹{o.totalAmount}</p>

                {o.status === 'pending' && (
                  <button className="danger" style={{ marginTop: 10 }} onClick={() => handleCancel(o._id)}>Cancel Order</button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyOrders;
