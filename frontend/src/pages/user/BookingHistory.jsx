import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const statusColor = {
  pending: '#f59e0b', accepted: '#3b82f6',
  ongoing: '#10b981', completed: '#6366f1', cancelled: '#ef4444',
};

const BookingHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/users/history');
        setRides(data);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredRides = filter === 'all' ? rides : rides.filter((r) => r.status === filter);

  const handleRate = async (rideId) => {
    try {
      await API.put(`/rides/${rideId}/rate`, { rating });
      setRides(rides.map((r) => r._id === rideId ? { ...r, rating } : r));
      setRatingModal(null);
      toast.success('Rating submitted! ⭐');
    } catch (err) {
      toast.error('Rating failed');
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Booking History</h1>
        <p>All your past and current rides in one place</p>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'].map((f) => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner"></div></div>
      ) : filteredRides.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No rides found</h3>
          <p>Your rides will appear here</p>
          <Link to="/book" className="btn-primary-sm">Book Your First Ride</Link>
        </div>
      ) : (
        <div className="rides-list">
          {filteredRides.map((ride) => (
            <div className="ride-card" key={ride._id}>
              <div className="ride-card-header">
                <div className="route-summary">
                  <span className="pickup-addr">📍 {ride.pickupLocation.address}</span>
                  <span className="route-arr">→</span>
                  <span className="drop-addr">🏁 {ride.dropLocation.address}</span>
                </div>
                <span className="status-pill" style={{ background: statusColor[ride.status] + '22', color: statusColor[ride.status] }}>
                  {ride.status}
                </span>
              </div>
              <div className="ride-card-body">
                <div className="ride-detail"><span>🚗</span><span>{ride.cabType?.toUpperCase()}</span></div>
                <div className="ride-detail"><span>📏</span><span>{ride.distance} km</span></div>
                <div className="ride-detail"><span>⏱️</span><span>{ride.duration} min</span></div>
                <div className="ride-detail"><span>💰</span><span className="fare-text">₹{ride.fare}</span></div>
                {ride.driver && (
                  <div className="ride-detail"><span>👤</span><span>{ride.driver.name} · ⭐ {ride.driver.rating}</span></div>
                )}
              </div>
              <div className="ride-card-footer">
                <span className="ride-date">{new Date(ride.createdAt).toLocaleString()}</span>
                <div className="ride-actions">
                  {['pending', 'accepted', 'ongoing'].includes(ride.status) && (
                    <Link to={`/tracking/${ride._id}`} className="btn-sm-track">📍 Track</Link>
                  )}
                  {ride.status === 'completed' && !ride.rating && (
                    <button className="btn-sm-rate" onClick={() => setRatingModal(ride._id)}>⭐ Rate</button>
                  )}
                  {ride.rating && <span className="rated-badge">⭐ {ride.rating}/5</span>}
                  {ride.status === 'completed' && (
                    <Link to={`/payment/${ride._id}`} className="btn-sm-pay">💳 Receipt</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div className="modal-overlay" onClick={() => setRatingModal(null)}>
          <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Rate Your Ride</h3>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} className={`star ${s <= rating ? 'active' : ''}`} onClick={() => setRating(s)}>★</button>
              ))}
            </div>
            <button className="btn-submit-rating" onClick={() => handleRate(ratingModal)}>Submit Rating</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
