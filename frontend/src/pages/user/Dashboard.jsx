import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/users/history');
        setRides(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const activeRide = rides.find((r) => ['pending', 'accepted', 'ongoing'].includes(r.status));

  const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', ongoing: '#10b981', completed: '#6366f1', cancelled: '#ef4444' };

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <h1>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Where are you headed today?</p>
        <Link to="/book" className="btn-book-now">🚕 Book a Ride</Link>
      </div>

      {activeRide && (
        <div className="active-ride-banner">
          <div>
            <span className="pulse-dot"></span> Active Ride
            <strong> {activeRide.pickupLocation.address} → {activeRide.dropLocation.address}</strong>
          </div>
          <Link to={`/tracking/${activeRide._id}`} className="btn-track">Track Live →</Link>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card quick-action">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/book" className="qa-btn">
              <span>📍</span> Book Ride
            </Link>
            <Link to="/history" className="qa-btn">
              <span>📜</span> History
            </Link>
            <Link to="/book" className="qa-btn">
              <span>❤️</span> Saved Places
            </Link>
            <Link to="/history" className="qa-btn">
              <span>💳</span> Payments
            </Link>
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <h3>Your Stats</h3>
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-val">{rides.length}</span>
              <span className="stat-lbl">Total Rides</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">₹{rides.filter((r) => r.status === 'completed').reduce((s, r) => s + r.fare, 0)}</span>
              <span className="stat-lbl">Spent</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{rides.filter((r) => r.status === 'completed').length}</span>
              <span className="stat-lbl">Completed</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card recent-rides">
          <div className="card-header">
            <h3>Recent Rides</h3>
            <Link to="/history">See All →</Link>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : rides.length === 0 ? (
            <div className="empty-state">
              <p>No rides yet! <Link to="/book">Book your first ride</Link></p>
            </div>
          ) : (
            rides.map((ride) => (
              <div className="ride-item" key={ride._id}>
                <div className="ride-route">
                  <span className="pickup">📍 {ride.pickupLocation.address}</span>
                  <span className="arrow">↓</span>
                  <span className="drop">🏁 {ride.dropLocation.address}</span>
                </div>
                <div className="ride-meta">
                  <span style={{ color: statusColor[ride.status] }} className="status-badge">{ride.status}</span>
                  <span>₹{ride.fare}</span>
                  <span>{ride.cabType}</span>
                </div>
                {['pending', 'accepted', 'ongoing'].includes(ride.status) && (
                  <Link to={`/tracking/${ride._id}`} className="track-link">Track →</Link>
                )}
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card offers-card">
          <h3>🎁 Offers & Discounts</h3>
          <div className="offer-item">
            <div className="offer-badge">20% OFF</div>
            <div>
              <strong>First 3 Rides</strong>
              <p>Welcome bonus for new users</p>
            </div>
          </div>
          <div className="offer-item">
            <div className="offer-badge">₹50</div>
            <div>
              <strong>Refer a Friend</strong>
              <p>Get wallet credit on referral</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
