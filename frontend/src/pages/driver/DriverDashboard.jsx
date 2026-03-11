import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});

  const fetchData = async () => {
    try {
      const [myRides, avail] = await Promise.all([
        API.get('/drivers/rides'),
        API.get('/drivers/available-rides'),
      ]);
      setRides(myRides.data);
      setAvailableRides(avail.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleAvailability = async () => {
    try {
      const { data } = await API.put('/drivers/availability');
      setIsAvailable(data.isAvailable);
      toast.success(`You are now ${data.isAvailable ? '🟢 Online' : '🔴 Offline'}`);
    } catch (err) {
      toast.error('Failed to update availability');
    }
  };

  const acceptRide = async (rideId) => {
    try {
      await API.put(`/drivers/rides/${rideId}/accept`);
      toast.success('Ride accepted!');
      fetchData();
    } catch (err) { toast.error('Failed to accept ride'); }
  };

  const startRide = async (rideId) => {
    const otp = otpInputs[rideId];
    if (!otp) return toast.warning('Enter OTP');
    try {
      await API.put(`/drivers/rides/${rideId}/start`, { otp });
      toast.success('Ride started! 🚗');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid OTP'); }
  };

  const completeRide = async (rideId) => {
    try {
      await API.put(`/drivers/rides/${rideId}/complete`);
      toast.success('Ride completed! 🎉');
      fetchData();
    } catch (err) { toast.error('Failed to complete ride'); }
  };

  const activeRide = rides.find((r) => ['accepted', 'ongoing'].includes(r.status));
  const completedRides = rides.filter((r) => r.status === 'completed');
  const totalEarnings = completedRides.reduce((s, r) => s + r.fare, 0);

  if (!user?.isVerified && user?.isVerified !== undefined) {
    return (
      <div className="driver-unverified">
        <div className="unverified-icon">⏳</div>
        <h2>Verification Pending</h2>
        <p>Your account is under review by our admin team. You'll be notified once approved.</p>
      </div>
    );
  }

  return (
    <div className="driver-page">
      <div className="driver-header">
        <div>
          <h1>Driver Dashboard</h1>
          <p>Welcome, {user?.name}! Ready to roll?</p>
        </div>
        <button className={`availability-toggle ${isAvailable ? 'online' : 'offline'}`} onClick={toggleAvailability}>
          {isAvailable ? '🟢 Online' : '🔴 Offline'}
        </button>
      </div>

      {/* Stats */}
      <div className="driver-stats">
        <div className="driver-stat"><span className="ds-val">{completedRides.length}</span><span>Rides Done</span></div>
        <div className="driver-stat"><span className="ds-val">₹{totalEarnings}</span><span>Total Earnings</span></div>
        <div className="driver-stat"><span className="ds-val">⭐ {user?.rating || 4.5}</span><span>Rating</span></div>
        <div className="driver-stat"><span className="ds-val">{isAvailable ? '🟢' : '🔴'}</span><span>Status</span></div>
      </div>

      {/* Active Ride */}
      {activeRide && (
        <div className="active-ride-card">
          <div className="arc-header"><span className="live-dot"></span> Active Ride</div>
          <div className="arc-route">
            <div>📍 {activeRide.pickupLocation.address}</div>
            <div>🏁 {activeRide.dropLocation.address}</div>
          </div>
          <div className="arc-meta">
            <span>👤 {activeRide.user?.name}</span>
            <span>📞 {activeRide.user?.phone}</span>
            <span>💰 ₹{activeRide.fare}</span>
          </div>
          {activeRide.status === 'accepted' && (
            <div className="otp-start">
              <input
                placeholder="Enter OTP from rider"
                value={otpInputs[activeRide._id] || ''}
                onChange={(e) => setOtpInputs({ ...otpInputs, [activeRide._id]: e.target.value })}
              />
              <button onClick={() => startRide(activeRide._id)}>Start Ride</button>
            </div>
          )}
          {activeRide.status === 'ongoing' && (
            <button className="btn-complete" onClick={() => completeRide(activeRide._id)}>✅ Complete Ride</button>
          )}
        </div>
      )}

      {/* Available Rides to Accept */}
      {isAvailable && availableRides.length > 0 && (
        <div className="available-rides">
          <h3>🔔 New Ride Requests</h3>
          {availableRides.map((ride) => (
            <div className="avail-ride-card" key={ride._id}>
              <div className="avail-route">
                <span>📍 {ride.pickupLocation.address}</span>
                <span className="arr">→</span>
                <span>🏁 {ride.dropLocation.address}</span>
              </div>
              <div className="avail-meta">
                <span>💰 ₹{ride.fare}</span>
                <span>📏 {ride.distance} km</span>
                <span>🚗 {ride.cabType}</span>
              </div>
              <button className="btn-accept" onClick={() => acceptRide(ride._id)}>Accept Ride</button>
            </div>
          ))}
        </div>
      )}

      {/* My Ride History */}
      <div className="my-rides">
        <h3>My Ride History</h3>
        {loading ? <div className="spinner"></div> : rides.length === 0 ? (
          <p className="no-rides">No rides yet. Go online to receive requests!</p>
        ) : (
          rides.slice(0, 10).map((ride) => (
            <div className="my-ride-item" key={ride._id}>
              <div className="mri-route">
                <span>{ride.pickupLocation.address}</span>
                <span> → </span>
                <span>{ride.dropLocation.address}</span>
              </div>
              <div className="mri-meta">
                <span className={`status-badge status-${ride.status}`}>{ride.status}</span>
                <span>₹{ride.fare}</span>
                <span>{new Date(ride.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
