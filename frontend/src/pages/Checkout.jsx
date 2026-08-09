import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refreshCart();
  }, []);

  const itemsTotal = cart.items.reduce((sum, i) => sum + (i.foodItem?.price || 0) * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/orders', {
        deliveryAddress: address,
        paymentMethod,
        couponCode: couponCode || undefined
      });
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    }
    setBusy(false);
  };

  if (cart.items.length === 0) {
    return <Layout><div className="empty-state glass">Your cart is empty.</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="page-title">Checkout</h1>

      <form className="form-card glass" onSubmit={handleSubmit}>
        {error && <div className="error-msg">{error}</div>}

        <p className="course-meta" style={{ marginBottom: 14 }}>Items Total: ₹{itemsTotal} + ₹30 delivery</p>

        <label>Delivery Address</label>
        <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required />

        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="cod">Cash on Delivery</option>
          <option value="card">Credit / Debit Card</option>
          <option value="upi">UPI</option>
        </select>

        <label>Coupon Code (optional)</label>
        <input placeholder="e.g. WELCOME10" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

        <button type="submit" disabled={busy}>{busy ? 'Placing order...' : 'Place Order'}</button>
      </form>
    </Layout>
  );
};

export default Checkout;
