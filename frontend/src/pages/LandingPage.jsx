import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cabTypes = [
  { icon: '🚗', name: 'Mini', desc: 'Affordable & compact', price: '₹30 + ₹8/km' },
  { icon: '🚙', name: 'Sedan', desc: 'Comfortable & stylish', price: '₹50 + ₹12/km' },
  { icon: '🚐', name: 'SUV', desc: 'Spacious & smooth', price: '₹80 + ₹18/km' },
  { icon: '🏎️', name: 'Luxury', desc: 'Premium experience', price: '₹150 + ₹28/km' },
];

const features = [
  { icon: '📍', title: 'Real-Time Tracking', desc: 'Track your ride live on an interactive map as it happens.' },
  { icon: '🔐', title: 'Secure Login', desc: 'JWT-powered auth with encrypted passwords for your safety.' },
  { icon: '💳', title: 'Easy Payments', desc: 'Pay via card, UPI, wallet, or cash — your choice.' },
  { icon: '📜', title: 'Ride History', desc: 'Access all your past trips with fare receipts anytime.' },
  { icon: '⭐', title: 'Rate Your Driver', desc: 'Give feedback and help maintain quality drivers.' },
  { icon: '🎁', title: 'Discounts & Offers', desc: 'Grab wallet credits and exclusive promo deals.' },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Fast. Safe. Reliable.</div>
          <h1 className="hero-title">
            Your Ride,<br />
            <span className="gradient-text">Your Way</span>
          </h1>
          <p className="hero-subtitle">
            Book a cab in seconds. Track in real-time. Arrive in style.
            Ucab connects you with verified drivers across the city.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/book" className="btn-hero-primary">Book a Ride →</Link>
            ) : (
              <>
                <Link to="/register" className="btn-hero-primary">Get Started Free</Link>
                <Link to="/login" className="btn-hero-secondary">Sign In</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Happy Riders</span></div>
            <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Verified Drivers</span></div>
            <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">Average Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="cab-animation">
            <div className="road">
              <div className="road-line"></div>
            </div>
            <div className="cab-car">🚕</div>
            <div className="map-pin pulse">📍</div>
          </div>
        </div>
      </section>

      {/* Cab Types */}
      <section className="section">
        <div className="section-header">
          <h2>Choose Your Ride</h2>
          <p>From budget-friendly minis to premium luxury cabs</p>
        </div>
        <div className="cab-grid">
          {cabTypes.map((cab) => (
            <div className="cab-card" key={cab.name}>
              <div className="cab-icon">{cab.icon}</div>
              <h3>{cab.name}</h3>
              <p>{cab.desc}</p>
              <div className="cab-price">{cab.price}</div>
              {user ? (
                <Link to="/book" className="cab-btn">Book Now</Link>
              ) : (
                <Link to="/register" className="cab-btn">Book Now</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="section-header">
          <h2>Why Choose Ucab?</h2>
          <p>Everything you need for a seamless ride experience</p>
        </div>
        <div className="features-grid">
          {features.map((feat) => (
            <div className="feature-card" key={feat.title}>
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Book your ride in just 3 simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-icon">📍</div>
            <h3>Set Location</h3>
            <p>Enter your pickup and drop-off points</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-icon">🚗</div>
            <h3>Choose Cab</h3>
            <p>Pick from mini, sedan, SUV, or luxury</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-icon">✅</div>
            <h3>Ride & Pay</h3>
            <p>Enjoy your trip and pay securely</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="section-header">
          <h2>What Riders Say</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Used Ucab to catch my airport flight. Driver arrived in 4 mins. Absolutely love it!"</p>
            <div className="testimonial-author">⭐⭐⭐⭐⭐ — Sarah M.</div>
          </div>
          <div className="testimonial-card">
            <p>"The real-time tracking is a game changer. I always know exactly where my cab is."</p>
            <div className="testimonial-author">⭐⭐⭐⭐⭐ — Rahul K.</div>
          </div>
          <div className="testimonial-card">
            <p>"Super affordable Mini cabs for daily office commute. Saving ₹2000 every month!"</p>
            <div className="testimonial-author">⭐⭐⭐⭐⭐ — Priya S.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Roll?</h2>
        <p>Join thousands of happy riders on Ucab today</p>
        <div className="cta-actions">
          {user ? (
            <Link to="/book" className="btn-hero-primary">Book a Ride Now</Link>
          ) : (
            <Link to="/register" className="btn-hero-primary">Create Free Account</Link>
          )}
          {!user && <Link to="/register?type=driver" className="btn-hero-secondary">Become a Driver</Link>}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">🚕 Ucab</div>
        <p>© 2026 Ucab. Fast. Safe. Reliable. Built with ❤️ using MERN Stack.</p>
        <div className="footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
