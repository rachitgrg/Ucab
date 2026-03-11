import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="ucab-navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🚕</span> Ucab
      </Link>
      <div className="nav-links">
        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary-sm">Get Started</Link>
          </>
        ) : (
          <>
            {user.role === 'user' && (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/book" className="nav-link">Book</Link>
                <Link to="/history" className="nav-link">History</Link>
              </>
            )}
            {user.role === 'driver' && (
              <Link to="/driver" className="nav-link">Driver Panel</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            <div className="user-menu">
              <span className="user-name">👤 {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
