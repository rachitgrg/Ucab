import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const isDriver = searchParams.get('type') === 'driver';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, driverLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = isDriver
        ? await driverLogin(form.email, form.password)
        : await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🚕`);
      if (user.role === 'driver') navigate('/driver');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🚕</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Ucab account</p>
        </div>
        <div className="auth-tabs">
          <Link to="/login" className={!isDriver ? 'active' : ''}>Rider</Link>
          <Link to="/login?type=driver" className={isDriver ? 'active' : ''}>Driver</Link>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        {/* Demo credentials */}
        <div className="demo-creds">
          <p>🧪 <strong>Demo Admin:</strong> admin@ucab.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
