import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const isDriver = searchParams.get('type') === 'driver';
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    licenseNo: '', vehicleType: 'mini', vehicleNumber: '', vehicleModel: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, driverRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isDriver) {
        await driverRegister(form);
        navigate('/driver');
      } else {
        await register(form);
        navigate('/dashboard');
      }
      toast.success('Registration successful! Welcome to Ucab 🚕');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🚕</div>
          <h1>Join Ucab</h1>
          <p>Create your {isDriver ? 'driver' : 'rider'} account</p>
        </div>
        <div className="auth-tabs">
          <Link to="/register" className={!isDriver ? 'active' : ''}>Rider</Link>
          <Link to="/register?type=driver" className={isDriver ? 'active' : ''}>Driver</Link>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="Sarah Johnson" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="sarah@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
          </div>
          {isDriver && (
            <>
              <div className="form-group">
                <label>License Number</label>
                <input name="licenseNo" placeholder="DL1234567890" value={form.licenseNo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                  <option value="mini">Mini</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vehicle Number</label>
                <input name="vehicleNumber" placeholder="DL 01 AB 1234" value={form.vehicleNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Vehicle Model</label>
                <input name="vehicleModel" placeholder="Maruti Alto / Toyota Innova" value={form.vehicleModel} onChange={handleChange} />
              </div>
            </>
          )}
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
