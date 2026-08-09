import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import FoodCard from '../components/FoodCard';
import Reveal from '../components/Reveal';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Biryani', 'Pizza', 'Burgers', 'Desserts', 'Beverages'];

const Menu = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const { refreshCart } = useCart();

  const load = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (sort) params.sort = sort;
    if (vegOnly) params.veg = 'true';
    const { data } = await api.get('/food', { params });
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    refreshCart();
  }, [category, sort, vegOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const handleAddToCart = async (item) => {
    await api.post('/cart', { foodItemId: item._id, quantity: 1 });
    await refreshCart();
    setToast(`${item.name} added to cart`);
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <Layout>
      <h1 className="page-title">Explore the Menu</h1>

      {toast && <div className="toast">{toast}</div>}

      <form className="filter-bar glass" onSubmit={handleSearch}>
        <input placeholder="Search dishes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <label className="veg-toggle">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          Veg only
        </label>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="empty-state">Loading menu...</div>
      ) : items.length === 0 ? (
        <div className="empty-state glass">No dishes match your filters.</div>
      ) : (
        <div className="food-grid">
          {items.map((item, i) => (
            <Reveal key={item._id} delay={Math.min(i * 30, 300)}>
              <FoodCard item={item} onAddToCart={handleAddToCart} />
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Menu;
