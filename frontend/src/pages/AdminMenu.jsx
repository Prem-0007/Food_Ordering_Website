import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const CATEGORIES = ['Starters', 'Main Course', 'Biryani', 'Pizza', 'Burgers', 'Desserts', 'Beverages'];
const emptyForm = { name: '', description: '', price: '', category: 'Main Course', imageUrl: '', isVeg: true, isAvailable: true };

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/food');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditingId(item._id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/food/${editingId}`, payload);
      } else {
        await api.post('/food', payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setBusy(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this dish from the menu?')) return;
    await api.delete(`/food/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Manage Menu</h1>
        <button onClick={openCreate}>+ Add Dish</button>
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty-state glass">No dishes added yet.</div>
      ) : (
        <div className="food-grid">
          {items.map((item, i) => (
            <Reveal key={item._id} delay={Math.min(i * 30, 300)}>
              <div className="food-card glass">
                <div
                  className="food-card-image"
                  style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : {}}
                >
                  {!item.imageUrl && <span className="food-card-placeholder">{item.name.charAt(0)}</span>}
                  <span className={`veg-badge ${item.isVeg ? 'veg' : 'nonveg'}`}>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
                </div>
                <div className="food-card-body">
                  <h3>{item.name}</h3>
                  <p className="course-meta">{item.category}</p>
                  <p className="price-tag">₹{item.price}</p>
                  {!item.isAvailable && <span className="pill pill-danger">Unavailable</span>}
                  <div className="owner-actions" style={{ marginTop: 10, marginLeft: 0 }}>
                    <button className="secondary" onClick={() => openEdit(item)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <form className="modal-card glass" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Dish' : 'Add Dish'}</h2>
            {error && <div className="error-msg">{error}</div>}

            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <label>Price</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label>Image URL (optional)</label>
            <input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

            <div className="checkbox-row">
              <label><input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian</label>
              <label><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available</label>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" disabled={busy}>Save</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default AdminMenu;
