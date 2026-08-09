import { Link } from 'react-router-dom';

const FoodCard = ({ item, onAddToCart }) => {
  return (
    <div className="food-card glass">
      <Link to={`/food/${item._id}`}>
        <div
          className="food-card-image"
          style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : {}}
        >
          {!item.imageUrl && <span className="food-card-placeholder">{item.name.charAt(0)}</span>}
          <span className={`veg-badge ${item.isVeg ? 'veg' : 'nonveg'}`}>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
          {!item.isAvailable && <span className="sold-out-badge">Sold Out</span>}
        </div>
      </Link>
      <div className="food-card-body">
        <Link to={`/food/${item._id}`} className="food-card-title-link">
          <h3>{item.name}</h3>
        </Link>
        <p className="course-meta">{item.category}</p>
        {item.ratingCount > 0 && (
          <p className="course-meta">⭐ {item.avgRating} ({item.ratingCount})</p>
        )}
        <div className="food-card-footer">
          <span className="price-tag">₹{item.price}</span>
          <button disabled={!item.isAvailable} onClick={() => onAddToCart(item)}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
