import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FoodDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [{ data: foodItem }, { data: revs }] = await Promise.all([
      api.get(`/food/${id}`),
      api.get(`/reviews/${id}`)
    ]);
    setItem(foodItem);
    setReviews(revs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAddToCart = async () => {
    await api.post('/cart', { foodItemId: id, quantity: 1 });
    await refreshCart();
    setToast('Added to cart');
    setTimeout(() => setToast(''), 1800);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/reviews/${id}`, { rating, comment });
      setComment('');
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
    setBusy(false);
  };

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;
  if (!item) return <Layout><div className="empty-state glass">Item not found.</div></Layout>;

  return (
    <Layout>
      {toast && <div className="toast">{toast}</div>}
      <Reveal>
        <div className="food-detail glass">
          <div
            className="food-detail-image"
            style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : {}}
          >
            {!item.imageUrl && <span className="food-card-placeholder large">{item.name.charAt(0)}</span>}
          </div>
          <div className="food-detail-body">
            <span className={`veg-badge static ${item.isVeg ? 'veg' : 'nonveg'}`}>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
            <h1>{item.name}</h1>
            <p className="course-meta">{item.category}</p>
            {item.ratingCount > 0 && <p className="course-meta">⭐ {item.avgRating} ({item.ratingCount} reviews)</p>}
            <p className="event-description">{item.description}</p>
            <div className="food-detail-footer">
              <span className="price-tag large">₹{item.price}</span>
              <button disabled={!item.isAvailable} onClick={handleAddToCart}>
                {item.isAvailable ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {user?.role === 'customer' && (
        <Reveal delay={80}>
          <div className="panel glass">
            <h2>Leave a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <label>Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
              <label>Comment (optional)</label>
              <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="submit" disabled={busy}>Submit Review</button>
            </form>
          </div>
        </Reveal>
      )}

      <Reveal delay={140}>
        <div className="panel glass">
          <h2>Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="empty-state">No reviews yet. Be the first!</div>
          ) : (
            <div className="reg-list">
              {reviews.map((r) => (
                <div key={r._id} className="record-item glass">
                  <div className="record-header">
                    <h3>{r.user?.name}</h3>
                    <span className="course-meta">⭐ {r.rating}</span>
                  </div>
                  {r.comment && <p className="course-meta">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </Layout>
  );
};

export default FoodDetails;
