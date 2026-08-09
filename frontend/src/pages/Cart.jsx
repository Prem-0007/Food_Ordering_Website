import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart().then(() => setLoading(false));
  }, []);

  const handleUpdateQty = async (foodItemId, quantity) => {
    await api.put(`/cart/${foodItemId}`, { quantity });
    await refreshCart();
  };

  const handleRemove = async (foodItemId) => {
    await api.delete(`/cart/${foodItemId}`);
    await refreshCart();
  };

  const itemsTotal = cart.items.reduce((sum, i) => sum + (i.foodItem?.price || 0) * i.quantity, 0);

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="empty-state glass">
          Your cart is empty. <Link to="/">Browse the menu</Link>
        </div>
      ) : (
        <>
          <div className="reg-list">
            {cart.items.map((i) => (
              <div key={i.foodItem._id} className="reg-item glass">
                <div>
                  <h3>{i.foodItem.name}</h3>
                  <p className="course-meta">₹{i.foodItem.price} each</p>
                </div>
                <div className="reg-actions">
                  <div className="qty-control">
                    <button className="secondary" onClick={() => handleUpdateQty(i.foodItem._id, i.quantity - 1)}>-</button>
                    <span>{i.quantity}</span>
                    <button className="secondary" onClick={() => handleUpdateQty(i.foodItem._id, i.quantity + 1)}>+</button>
                  </div>
                  <span className="price-tag">₹{i.foodItem.price * i.quantity}</span>
                  <button className="danger" onClick={() => handleRemove(i.foodItem._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="panel glass" style={{ marginTop: 20 }}>
            <h2>Order Summary</h2>
            <p className="course-meta">Items Total: ₹{itemsTotal}</p>
            <p className="course-meta">Delivery Fee: ₹30</p>
            <p className="fee-tag" style={{ marginTop: 8 }}>Estimated Total: ₹{itemsTotal + 30}</p>
            <button style={{ width: '100%', marginTop: 14 }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Cart;
