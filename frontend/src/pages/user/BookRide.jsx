import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const cabTypes = [
  { type: 'mini', icon: '🚗', name: 'Mini', desc: 'Affordable pick', perKm: 8, base: 30 },
  { type: 'sedan', icon: '🚙', name: 'Sedan', desc: 'Comfortable ride', perKm: 12, base: 50 },
  { type: 'suv', icon: '🚐', name: 'SUV', desc: 'Spacious & roomy', perKm: 18, base: 80 },
  { type: 'luxury', icon: '🏎️', name: 'Luxury', desc: 'Premium comfort', perKm: 28, base: 150 },
];

// Indian city coords for demo
const cityCoords = {
  'Delhi, India': { lat: 28.6139, lng: 77.2090 },
  'Mumbai, India': { lat: 19.0760, lng: 72.8777 },
  'Bangalore, India': { lat: 12.9716, lng: 77.5946 },
  'Chennai, India': { lat: 13.0827, lng: 80.2707 },
  'Hyderabad, India': { lat: 17.3850, lng: 78.4867 },
  'Connaught Place, Delhi': { lat: 28.6315, lng: 77.2167 },
  'IGI Airport, Delhi': { lat: 28.5562, lng: 77.1000 },
  'Bandra, Mumbai': { lat: 19.0596, lng: 72.8295 },
  'Koramangala, Bangalore': { lat: 12.9352, lng: 77.6245 },
  'Gachibowli, Hyderabad': { lat: 17.4401, lng: 78.3489 },
};

const BookRide = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [selectedCab, setSelectedCab] = useState(null);
  const [estimates, setEstimates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=location, 2=cab, 3=confirm

  const getCoords = (place) => {
    const key = Object.keys(cityCoords).find((k) => k.toLowerCase().includes(place.toLowerCase().trim()));
    if (key) return cityCoords[key];
    // Random offset from Delhi as fallback
    return { lat: 28.6139 + (Math.random() - 0.5) * 0.2, lng: 77.2090 + (Math.random() - 0.5) * 0.2 };
  };

  const handleEstimate = async () => {
    if (!pickup || !drop) return toast.warning('Please enter pickup and drop locations');
    setLoading(true);
    try {
      const pickupCoords = getCoords(pickup);
      const dropCoords = getCoords(drop);
      const { data } = await API.post('/rides/estimate', {
        pickupLat: pickupCoords.lat, pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat, dropLng: dropCoords.lng,
      });
      setEstimates(data);
      setStep(2);
    } catch (err) {
      toast.error('Could not get estimates. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedCab) return toast.warning('Please select a cab type');
    setBookingLoading(true);
    try {
      const pickupCoords = getCoords(pickup);
      const dropCoords = getCoords(drop);
      const { data } = await API.post('/rides/book', {
        pickupLocation: { address: pickup, ...pickupCoords },
        dropLocation: { address: drop, ...dropCoords },
        cabType: selectedCab.type,
      });
      toast.success('Ride booked successfully! 🚕');
      navigate(`/tracking/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const selectedEstimate = estimates?.estimates?.find((e) => e.type === selectedCab?.type);

  return (
    <div className="book-page">
      <div className="book-header">
        <h1>Book Your Ride</h1>
        <div className="step-indicators">
          {['Locations', 'Choose Cab', 'Confirm'].map((s, i) => (
            <div key={s} className={`step-ind ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <span className="step-circle">{step > i + 1 ? '✓' : i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="book-container">
        <div className="book-form-panel">
          {/* Step 1: Locations */}
          <div className="book-section">
            <h3>📍 Set Locations</h3>
            <div className="location-inputs">
              <div className="loc-input-wrap pickup-wrap">
                <span className="loc-dot green-dot"></span>
                <input
                  className="loc-input"
                  placeholder="Pickup location (e.g. Connaught Place, Delhi)"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  list="pickup-suggestions"
                />
                <datalist id="pickup-suggestions">
                  {Object.keys(cityCoords).map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="loc-divider">|</div>
              <div className="loc-input-wrap drop-wrap">
                <span className="loc-dot red-dot"></span>
                <input
                  className="loc-input"
                  placeholder="Drop location (e.g. IGI Airport, Delhi)"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  list="drop-suggestions"
                />
                <datalist id="drop-suggestions">
                  {Object.keys(cityCoords).map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>
            <button className="btn-estimate" onClick={handleEstimate} disabled={loading}>
              {loading ? '⏳ Getting estimates...' : '🔍 Search Cabs →'}
            </button>
          </div>

          {/* Step 2: Cab Selection */}
          {step >= 2 && estimates && (
            <div className="book-section cab-selection">
              <h3>🚗 Choose Your Cab</h3>
              <p className="distance-info">📏 Distance: {estimates.distance} km</p>
              <div className="cab-options">
                {cabTypes.map((cab) => {
                  const est = estimates.estimates?.find((e) => e.type === cab.type);
                  return (
                    <div
                      key={cab.type}
                      className={`cab-option ${selectedCab?.type === cab.type ? 'selected' : ''}`}
                      onClick={() => { setSelectedCab(cab); setStep(3); }}
                    >
                      <div className="cab-opt-icon">{cab.icon}</div>
                      <div className="cab-opt-info">
                        <strong>{cab.name}</strong>
                        <span>{cab.desc}</span>
                        {est && <span className="eta">ETA: {est.eta} min</span>}
                      </div>
                      <div className="cab-opt-fare">
                        {est ? `₹${est.fare}` : `₹${cab.base}+`}
                        <span>{est ? `${est.duration} min` : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedCab && selectedEstimate && (
            <div className="book-section confirm-section">
              <h3>✅ Confirm Booking</h3>
              <div className="confirm-details">
                <div className="confirm-row">
                  <span>Pickup</span>
                  <strong>{pickup}</strong>
                </div>
                <div className="confirm-row">
                  <span>Drop</span>
                  <strong>{drop}</strong>
                </div>
                <div className="confirm-row">
                  <span>Cab Type</span>
                  <strong>{selectedCab.icon} {selectedCab.name}</strong>
                </div>
                <div className="confirm-row">
                  <span>Distance</span>
                  <strong>{estimates.distance} km</strong>
                </div>
                <div className="confirm-row">
                  <span>ETA</span>
                  <strong>~{selectedEstimate.eta} min</strong>
                </div>
                <div className="confirm-row fare-row">
                  <span>Total Fare</span>
                  <strong className="total-fare">₹{selectedEstimate.fare}</strong>
                </div>
              </div>
              <button className="btn-confirm-book" onClick={handleBook} disabled={bookingLoading}>
                {bookingLoading ? '⏳ Booking...' : '🚕 Confirm & Book Ride'}
              </button>
            </div>
          )}
        </div>

        {/* Map Panel */}
        <div className="book-map-panel">
          <div className="map-placeholder">
            <div className="map-bg">
              <div className="map-visual">
                <div className="map-grid"></div>
                <div className="map-pickup" title={pickup}>📍</div>
                <div className="map-drop" title={drop}>🏁</div>
                <div className="map-route-line"></div>
                <div className="map-cab-icon">🚕</div>
              </div>
              <div className="map-info-overlay">
                {pickup && <div>From: <strong>{pickup}</strong></div>}
                {drop && <div>To: <strong>{drop}</strong></div>}
                {!pickup && !drop && <div>Enter locations to see route</div>}
              </div>
            </div>
          </div>
          <div className="popular-locations">
            <h4>Popular Destinations</h4>
            <div className="pop-locs">
              {['IGI Airport, Delhi', 'Connaught Place, Delhi', 'Bandra, Mumbai', 'Koramangala, Bangalore'].map((loc) => (
                <button key={loc} className="pop-loc-btn" onClick={() => setDrop(loc)}>{loc}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide;
