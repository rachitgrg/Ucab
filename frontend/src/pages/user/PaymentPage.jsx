import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const PaymentPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [payment, setPayment] = useState(null);
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: rideData } = await API.get(`/rides/${rideId}`);
        setRide(rideData);
        try {
          const { data: payData } = await API.get(`/payments/ride/${rideId}`);
          setPayment(payData);
        } catch (_) { /* no payment yet */ }
      } catch (err) {
        toast.error('Ride not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [rideId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const { data } = await API.post('/payments', { rideId, method });
      setPayment(data);
      toast.success('Payment successful! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!ride) return <div className="error-page">Ride not found. <Link to="/history">Go back</Link></div>;

  return (
    <div className="payment-page">
      <Link to="/history" className="back-btn">← Back to History</Link>
      <h1>Payment & Receipt</h1>

      {payment ? (
        // Receipt View
        <div className="receipt-card">
          <div className="receipt-header">
            <div className="receipt-logo">🚕 Ucab</div>
            <div className="receipt-badge">✅ PAID</div>
          </div>
          <div className="receipt-id">Transaction ID: <strong>{payment.transactionId}</strong></div>
          <div className="receipt-id">Receipt: <strong>{payment.receipt}</strong></div>
          <div className="receipt-divider"></div>
          <div className="receipt-row"><span>Pickup</span><span>{ride.pickupLocation.address}</span></div>
          <div className="receipt-row"><span>Drop-off</span><span>{ride.dropLocation.address}</span></div>
          <div className="receipt-row"><span>Cab Type</span><span>{ride.cabType?.toUpperCase()}</span></div>
          <div className="receipt-row"><span>Distance</span><span>{ride.distance} km</span></div>
          <div className="receipt-row"><span>Duration</span><span>{ride.duration} min</span></div>
          <div className="receipt-row"><span>Payment Method</span><span>{payment.method?.toUpperCase()}</span></div>
          <div className="receipt-divider"></div>
          <div className="receipt-total">
            <span>Total Amount</span>
            <span className="receipt-amount">₹{payment.amount}</span>
          </div>
          <div className="receipt-date">{new Date(payment.createdAt).toLocaleString()}</div>
          <button className="btn-print" onClick={() => window.print()}>🖨️ Print Receipt</button>
          <Link to="/dashboard" className="btn-home">🏠 Back to Dashboard</Link>
        </div>
      ) : (
        // Payment Form
        <div className="payment-container">
          <div className="fare-summary">
            <h3>Fare Breakdown</h3>
            <div className="fare-row"><span>Base Fare</span><span>₹{ride.cabType === 'mini' ? 30 : ride.cabType === 'sedan' ? 50 : ride.cabType === 'suv' ? 80 : 150}</span></div>
            <div className="fare-row"><span>Distance ({ride.distance} km)</span><span>₹{ride.fare - (ride.cabType === 'mini' ? 30 : ride.cabType === 'sedan' ? 50 : ride.cabType === 'suv' ? 80 : 150)}</span></div>
            <div className="fare-divider"></div>
            <div className="fare-row total-row"><span>Total</span><span className="total-fare">₹{ride.fare}</span></div>
          </div>

          <div className="payment-methods">
            <h3>Choose Payment Method</h3>
            <div className="methods-grid">
              {[
                { id: 'upi', icon: '📱', label: 'UPI' },
                { id: 'card', icon: '💳', label: 'Card' },
                { id: 'wallet', icon: '👛', label: 'Wallet' },
                { id: 'cash', icon: '💵', label: 'Cash' },
              ].map((m) => (
                <div key={m.id} className={`method-card ${method === m.id ? 'selected' : ''}`} onClick={() => setMethod(m.id)}>
                  <span className="method-icon">{m.icon}</span>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {ride.status !== 'completed' && (
            <div className="payment-warning">⚠️ Ride must be completed before payment</div>
          )}

          <button
            className="btn-pay-now"
            onClick={handlePay}
            disabled={paying || ride.status !== 'completed'}
          >
            {paying ? '⏳ Processing...' : `💳 Pay ₹${ride.fare}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
