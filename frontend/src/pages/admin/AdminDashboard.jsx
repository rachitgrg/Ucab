import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, u, d, r] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
          API.get('/admin/drivers'),
          API.get('/admin/rides'),
        ]);
        setStats(s.data);
        setUsers(u.data);
        setDrivers(d.data);
        setRides(r.data);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleVerify = async (driverId) => {
    try {
      const { data } = await API.put(`/admin/drivers/${driverId}/verify`);
      setDrivers(drivers.map((d) => d._id === driverId ? { ...d, isVerified: data.driver.isVerified } : d));
      toast.success(`Driver ${data.driver.isVerified ? 'verified ✅' : 'unverified'}`);
    } catch { toast.error('Action failed'); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  const statCards = [
    { icon: '👥', label: 'Total Users', val: stats?.users },
    { icon: '🧑‍✈️', label: 'Total Drivers', val: stats?.drivers },
    { icon: '🚕', label: 'Total Rides', val: stats?.rides },
    { icon: '💰', label: 'Revenue', val: `₹${stats?.revenue || 0}` },
    { icon: '✅', label: 'Completed', val: stats?.completedRides },
    { icon: '⏳', label: 'Pending', val: stats?.pendingRides },
  ];

  const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', ongoing: '#10b981', completed: '#6366f1', cancelled: '#ef4444' };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Ucab Platform Management</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        {statCards.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className="asc-icon">{s.icon}</div>
            <div>
              <div className="asc-val">{s.val}</div>
              <div className="asc-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview', 'users', 'drivers', 'rides'].map((t) => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="admin-overview">
          <div className="overview-chart">
            <h3>Ride Status Distribution</h3>
            <div className="status-bars">
              {[
                { label: 'Completed', val: stats?.completedRides, color: '#6366f1' },
                { label: 'Pending', val: stats?.pendingRides, color: '#f59e0b' },
              ].map((b) => (
                <div key={b.label} className="status-bar-item">
                  <div className="sbi-label">{b.label}</div>
                  <div className="sbi-bar">
                    <div style={{ width: `${stats?.rides ? (b.val / stats.rides) * 100 : 0}%`, background: b.color }}></div>
                  </div>
                  <div className="sbi-val">{b.val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="recent-activity">
            <h3>Recent Rides</h3>
            {rides.slice(0, 5).map((r) => (
              <div className="activity-item" key={r._id}>
                <span>{r.user?.name || 'User'}</span>
                <span>{r.pickupLocation.address} → {r.dropLocation.address}</span>
                <span style={{ color: statusColor[r.status] }}>{r.status}</span>
                <span>₹{r.fare}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-table-wrap">
          <h3>All Users ({users.length})</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{u.role !== 'admin' && <button className="btn-del" onClick={() => deleteUser(u._id)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'drivers' && (
        <div className="admin-table-wrap">
          <h3>All Drivers ({drivers.length})</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Vehicle</th><th>Type</th><th>Rating</th><th>Verified</th><th>Action</th></tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.vehicleNumber}</td>
                  <td>{d.vehicleType?.toUpperCase()}</td>
                  <td>⭐ {d.rating}</td>
                  <td>
                    <span className={`verify-badge ${d.isVerified ? 'verified' : 'unverified'}`}>
                      {d.isVerified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-verify" onClick={() => toggleVerify(d._id)}>
                      {d.isVerified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'rides' && (
        <div className="admin-table-wrap">
          <h3>All Rides ({rides.length})</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Rider</th><th>Driver</th><th>Route</th><th>Fare</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {rides.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name || '—'}</td>
                  <td>{r.driver?.name || 'Unassigned'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.pickupLocation.address} → {r.dropLocation.address}
                  </td>
                  <td>₹{r.fare}</td>
                  <td><span style={{ color: statusColor[r.status] }}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
