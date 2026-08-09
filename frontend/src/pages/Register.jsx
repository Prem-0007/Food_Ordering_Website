import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', email: '', password: '', phone: '', address: '' };

const Register = () => {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({ ...form, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card glass" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="subtitle">Join TastyBite</p>
        {error && <div className="error-msg">{error}</div>}

        <label>Account Type</label>
        <div className="role-toggle">
          <button type="button" className={role === 'customer' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('customer')}>Customer</button>
          <button type="button" className={role === 'admin' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('admin')}>Restaurant Admin</button>
        </div>

        <label>Full Name</label>
        <input value={form.name} onChange={set('name')} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={set('email')} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={set('password')} minLength={6} required />
        <label>Phone</label>
        <input value={form.phone} onChange={set('phone')} />
        {role === 'customer' && (
          <>
            <label>Default Delivery Address (optional)</label>
            <input value={form.address} onChange={set('address')} />
          </>
        )}

        <button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
