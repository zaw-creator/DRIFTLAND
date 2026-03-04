'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './registrations.css';

const STATUS_CLASS = {
  pending: 'status-pending',
  verified: 'status-verified',
  rejected: 'status-rejected',
  cancelled: 'status-cancelled',
};

export default function AdminRegistrations() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg._id === id ? { ...reg, status } : reg))
        );
      }
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="reg-loading">Loading registrations...</div>;

  return (
    <div className="registrations-page">
      <nav className="reg-navbar">
        <div className="logo">
          <div>
            <span className="accent">Drift</span>
            <span className="brand">Land</span>
          </div>
          <p className="subtitle">Admin Portal</p>
        </div>
        <button className="reg-back-button" onClick={() => router.push('/admin')}>
          ← Back to Dashboard
        </button>
      </nav>

      <div className="reg-content">
        <div className="reg-header">
          <h1 className="reg-heading">Registrations</h1>
          <span className="reg-count">{registrations.length} total</span>
        </div>

        {error && <div className="reg-error">{error}</div>}

        <div className="reg-table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>Reg No.</th>
                <th>Driver</th>
                <th>Event</th>
                <th>Drive Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="reg-empty">No registrations yet</div>
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td><span className="reg-number">{reg.registrationNumber}</span></td>
                    <td>
                      <div className="reg-driver-name">{reg.driverId?.fullName || 'N/A'}</div>
                      <div className="reg-driver-email">{reg.driverId?.email}</div>
                    </td>
                    <td>
                      <div className="reg-event-name">{reg.eventId?.name || 'N/A'}</div>
                      <div className="reg-event-date">
                        {reg.eventId?.eventDate
                          ? new Date(reg.eventId.eventDate).toLocaleDateString()
                          : ''}
                      </div>
                    </td>
                    <td>{reg.driveType}</td>
                    <td className="reg-date">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[reg.status]}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td>
                      <div className="reg-actions">
                        <button
                          className="btn-view"
                          onClick={() => router.push(`/admin/registrations/${reg._id}`)}
                        >
                          View
                        </button>
                        {reg.status !== 'verified' && (
                          <button
                            className={`btn-verify ${updatingId === reg._id ? 'btn-disabled' : ''}`}
                            onClick={() => updateStatus(reg._id, 'verified')}
                            disabled={updatingId === reg._id}
                          >
                            Verify
                          </button>
                        )}
                        {reg.status !== 'rejected' && (
                          <button
                            className={`btn-reject ${updatingId === reg._id ? 'btn-disabled' : ''}`}
                            onClick={() => updateStatus(reg._id, 'rejected')}
                            disabled={updatingId === reg._id}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}