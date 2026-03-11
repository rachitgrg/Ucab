import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import API from '../../api/axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const cabIcon = L.divIcon({ className: '', html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px #000)">🚕</div>', iconSize: [32, 32] });
const pickupIcon = L.divIcon({ className: '', html: '<div style="font-size:24px">📍</div>', iconSize: [24, 24] });
const dropIcon = L.divIcon({ className: '', html: '<div style="font-size:24px">🏁</div>', iconSize: [24, 24] });

const statusLabels = {
  pending: { label: '🔍 Searching for driver...', color: '#f59e0b' },
  accepted: { label: '✅ Driver accepted! On the way...', color: '#3b82f6' },
  ongoing: { label: '🚗 Ride in progress', color: '#10b981' },
  completed: { label: '🎉 Ride completed!', color: '#6366f1' },
  cancelled: { label: '❌ Ride cancelled', color: '#ef4444' },
};

const TrackingPage = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchRide = async () => {
    try {
      const { data } = await API.get(`/rides/${id}`);
      setRide(data);
      if (data.driver?.currentLocation) {
        setDriverPos([data.driver.currentLocation.lat, data.driver.currentLocation.lng]);
      }
      if (['completed', 'cancelled'].includes(data.status)) {
        clearInterval(intervalRef.current);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Simulate driver movement
  const simulateMovement = () => {
    setDriverPos((prev) => {
      if (!prev) return prev;
      return [prev[0] + (Math.random() - 0.5) * 0.001, prev[1] + (Math.random() - 0.5) * 0.001];
    });
  };

  useEffect(() => {
    fetchRide();
    intervalRef.current = setInterval(() => {
      fetchRide();
      simulateMovement();
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner"></div><p>Loading ride...</p></div>;
  if (!ride) return <div className="error-page">Ride not found. <Link to="/dashboard">Go back</Link></div>;

  const pickupPos = [ride.pickupLocation.lat, ride.pickupLocation.lng];
  const dropPos = [ride.dropLocation.lat, ride.dropLocation.lng];
  const center = driverPos || pickupPos;
  const statusInfo = statusLabels[ride.status] || statusLabels.pending;

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <Link to="/dashboard" className="back-btn">← Back</Link>
        <h1>Live Tracking</h1>
        <div className="ride-otp">OTP: <strong>{ride.otp}</strong></div>
      </div>

      <div className="tracking-container">
        {/* Map */}
        <div className="tracking-map">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={pickupPos} icon={pickupIcon}>
              <Popup>📍 Pickup: {ride.pickupLocation.address}</Popup>
            </Marker>
            <Marker position={dropPos} icon={dropIcon}>
              <Popup>🏁 Drop: {ride.dropLocation.address}</Popup>
            </Marker>
            {driverPos && (
              <Marker position={driverPos} icon={cabIcon}>
                <Popup>🚕 {ride.driver?.name || 'Your Driver'}</Popup>
              </Marker>
            )}
            <Polyline positions={[pickupPos, ...(driverPos ? [driverPos] : []), dropPos]} color="#f59e0b" weight={3} dashArray="8,6" />
          </MapContainer>
        </div>

        {/* Info Panel */}
        <div className="tracking-info">
          <div className="status-bar" style={{ background: statusInfo.color + '22', borderColor: statusInfo.color }}>
            <span style={{ color: statusInfo.color }}>{statusInfo.label}</span>
          </div>

          {ride.driver && (
            <div className="driver-card">
              <div className="driver-avatar">🧑‍✈️</div>
              <div className="driver-details">
                <h3>{ride.driver.name}</h3>
                <p>⭐ {ride.driver.rating} · {ride.driver.vehicleType?.toUpperCase()}</p>
                <p>🚗 {ride.driver.vehicleNumber}</p>
              </div>
              <a href={`tel:${ride.driver.phone}`} className="call-btn">📞</a>
            </div>
          )}

          {!ride.driver && ride.status === 'pending' && (
            <div className="searching-card">
              <div className="searching-animation">⏳</div>
              <p>Connecting you with a nearby driver...</p>
            </div>
          )}

          <div className="route-card">
            <div className="route-point pickup">
              <span className="dot green"></span>
              <div>
                <small>Pickup</small>
                <strong>{ride.pickupLocation.address}</strong>
              </div>
            </div>
            <div className="route-line-v"></div>
            <div className="route-point drop">
              <span className="dot red"></span>
              <div>
                <small>Drop-off</small>
                <strong>{ride.dropLocation.address}</strong>
              </div>
            </div>
          </div>

          <div className="fare-card">
            <div className="fare-item"><span>Distance</span><strong>{ride.distance} km</strong></div>
            <div className="fare-item"><span>Duration</span><strong>~{ride.duration} min</strong></div>
            <div className="fare-item"><span>Fare</span><strong className="total-fare">₹{ride.fare}</strong></div>
          </div>

          {ride.status === 'completed' && (
            <Link to={`/payment/${ride._id}`} className="btn-pay">💳 Pay & Get Receipt →</Link>
          )}
          {['pending', 'accepted'].includes(ride.status) && (
            <button className="btn-cancel" onClick={async () => {
              await API.put(`/rides/${id}/cancel`);
              fetchRide();
            }}>Cancel Ride</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
