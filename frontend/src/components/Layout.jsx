import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const customerLinks = [
  { to: '/', label: 'Menu' },
  { to: '/orders', label: 'My Orders' }
];

const adminLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/admin/menu', label: 'Manage Menu' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/reports', label: 'Reports' }
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <div className="app-shell">
      <header className="topnav glass">
        <NavLink to="/" className="brand">TastyBite</NavLink>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-right">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user?.role === 'customer' && (
            <NavLink to="/cart" className="cart-btn">
              🛒
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </NavLink>
          )}
          <span className="role-chip">{user?.role}</span>
          <span className="user-chip">{user?.name}</span>
          <button className="secondary logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
