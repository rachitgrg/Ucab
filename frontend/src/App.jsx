import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/user/Dashboard';
import BookRide from './pages/user/BookRide';
import TrackingPage from './pages/user/TrackingPage';
import BookingHistory from './pages/user/BookingHistory';
import PaymentPage from './pages/user/PaymentPage';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['user', 'admin']}><Dashboard /></ProtectedRoute>
          } />
          <Route path="/book" element={
            <ProtectedRoute roles={['user']}><BookRide /></ProtectedRoute>
          } />
          <Route path="/tracking/:id" element={
            <ProtectedRoute roles={['user', 'driver']}><TrackingPage /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute roles={['user']}><BookingHistory /></ProtectedRoute>
          } />
          <Route path="/payment/:rideId" element={
            <ProtectedRoute roles={['user']}><PaymentPage /></ProtectedRoute>
          } />
          <Route path="/driver" element={
            <ProtectedRoute roles={['driver']}><DriverDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={
            <div className="not-found">
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
