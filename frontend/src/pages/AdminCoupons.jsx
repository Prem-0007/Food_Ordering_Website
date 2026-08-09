import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

const emptyForm = { code: '', discountPercent: '', minOrderAmount: '' };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/coupons');
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/coupons', {
        code: form.code,
        discountPercent: Number(form.discountPercent),
        minOrderAmount: Number(form.minOrderAmount) || 0
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
    setBusy(false);
  };

  const handleToggle = async (id) => {
    await api.put(`/coupons/${id}/toggle`);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await api.delete(`/coupons/${id}`);
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">Coupons</h1>

      <form className="form-card glass" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Create Coupon</h2>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-row">
          <div>
            <label>Code</label>
            <input placeholder="WELCOME10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          </div>
          <div>
            <label>Discount %</label>
            <input type="number" min="1" max="90" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} required />
          </div>
        </div>
        <label>Minimum Order Amount (optional)</label>
        <input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
        <button type="submit" disabled={busy}>Create Coupon</button>
      </form>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : coupons.length === 0 ? (
        <div className="empty-state glass">No coupons yet.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.code}</td>
                  <td>{c.discountPercent}%</td>
                  <td>₹{c.minOrderAmount}</td>
                  <td><span className={`pill ${c.isActive ? 'pill-success' : 'pill-muted'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="actions">
                    <button className="secondary" onClick={() => handleToggle(c._id)}>{c.isActive ? 'Disable' : 'Enable'}</button>
                    <button className="danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminCoupons;
