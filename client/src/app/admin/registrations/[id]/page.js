'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import './detail.css';

const STATUS_CLASS = {
  pending: 'status-pending',
  verified: 'status-verified',
  rejected: 'status-rejected',
  cancelled: 'status-cancelled',
};

export default function RegistrationDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchRegistration();
  }, []);

  const fetchRegistration = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await response.json();
      setRegistration(data);
    } catch (err) {
      setError('Failed to load registration');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    setUpdating(true);
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
        setRegistration((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getImageUrl = (filePath) => {
    if (!filePath) return null;
    const cleanPath = filePath.replace(/\\/g, '/');
    return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
  };


  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!registration) return <div className="detail-not-found">Registration not found</div>;

  const driver = registration.driverId;
  const event = registration.eventId;
  const vehicle = registration.vehicleId;

  return (
    <div className="detail-page">
      <nav className="detail-navbar">
        <div className="logo">
          <div>
            <span className="accent">Drift</span>
            <span className="brand">Land</span>
          </div>
          <p className="subtitle">Admin Portal</p>
        </div>
        <button className="detail-back-button" onClick={() => router.push('/admin/registrations')}>
          ← Back to Registrations
        </button>
      </nav>

      <div className="detail-content">
        <div className="detail-header">
          <div>
            <div className="detail-reg-number">{registration.registrationNumber}</div>
            <span className={`status-badge ${STATUS_CLASS[registration.status]}`}>
              {registration.status}
            </span>
          </div>
          <div className="detail-actions">
            {registration.status !== 'verified' && (
              <button
                className={`btn-verify ${updating ? 'btn-disabled' : ''}`}
                onClick={() => updateStatus('verified')}
                disabled={updating}
              >
                Verify
              </button>
            )}
            {registration.status !== 'rejected' && (
              <button
                className={`btn-reject ${updating ? 'btn-disabled' : ''}`}
                onClick={() => updateStatus('rejected')}
                disabled={updating}
              >
                Reject
              </button>
            )}
            {registration.status !== 'cancelled' && (
              <button
                className={`btn-cancel ${updating ? 'btn-disabled' : ''}`}
                onClick={() => updateStatus('cancelled')}
                disabled={updating}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {error && <div className="detail-error">{error}</div>}

        <div className="detail-grid">

          {/* Driver Info */}
          <div className="detail-card">
            <div className="detail-card-title">Driver Information</div>
            <div className="detail-row">
              <span className="detail-row-label">Full Name</span>
              <span className="detail-row-value">{driver?.fullName || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Email</span>
              <span className="detail-row-value">{driver?.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Phone</span>
              <span className="detail-row-value">{driver?.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">License No.</span>
              <span className="detail-row-value mono">{driver?.licenseNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">License Expiry</span>
              <span className="detail-row-value">
                {driver?.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Blood Type</span>
              <span className="detail-row-value">{driver?.medicalInfo?.bloodType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Emergency Contact</span>
              <span className="detail-row-value">
                {driver?.emergencyContact?.name} ({driver?.emergencyContact?.phone})
              </span>
            </div>
          </div>

          {/* Driver Documents */}
<div className="detail-card">
  <div className="detail-card-title">Driver Documents</div>
  <div className="detail-image-grid">
    <div className="detail-image-wrapper">
      <div className="detail-image-label">Driver License</div>
      {driver?.uploads?.driverLicense ? (
        <img
          src={getImageUrl(driver.uploads.driverLicense)}
          alt="Driver License"
          onClick={() => window.open(getImageUrl(driver.uploads.driverLicense), '_blank')}
        />
      ) : (
        <div style={{ color: '#535653', padding: '1rem', fontSize: '0.8rem' }}>Not uploaded</div>
      )}
    </div>
    <div className="detail-image-wrapper">
      <div className="detail-image-label">Profile Photo</div>
      {driver?.uploads?.profilePhoto ? (
        <img
          src={getImageUrl(driver.uploads.profilePhoto)}
          alt="Profile Photo"
          onClick={() => window.open(getImageUrl(driver.uploads.profilePhoto), '_blank')}
        />
      ) : (
        <div style={{ color: '#535653', padding: '1rem', fontSize: '0.8rem' }}>Not uploaded</div>
      )}
    </div>
  </div>
</div>

          {/* Event Info */}
          <div className="detail-card">
            <div className="detail-card-title">Event Information</div>
            <div className="detail-row">
              <span className="detail-row-label">Event</span>
              <span className="detail-row-value">{event?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Date</span>
              <span className="detail-row-value">
                {event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Location</span>
              <span className="detail-row-value">{event?.location || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Drive Type</span>
              <span className="detail-row-value">{registration.driveType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Previous Experience</span>
              <span className="detail-row-value">
                {registration.previousExperience ? 'Yes' : 'No'}
              </span>
            </div>
            {registration.specialRequirements && (
              <div className="detail-row">
                <span className="detail-row-label">Special Requirements</span>
                <span className="detail-row-value">{registration.specialRequirements}</span>
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="detail-card">
            <div className="detail-card-title">Vehicle Information</div>
            {vehicle ? (
              <>
                <div className="detail-row">
                  <span className="detail-row-label">Make</span>
                  <span className="detail-row-value">{vehicle.make}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-row-label">Model</span>
                  <span className="detail-row-value">{vehicle.model}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-row-label">Year</span>
                  <span className="detail-row-value">{vehicle.year}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-row-label">Plate Number</span>
                  <span className="detail-row-value mono">{vehicle.plateNumber}</span>
                </div>
              </>
            ) : (
              <p style={{ color: '#535653', fontSize: '0.85rem' }}>No vehicle info available</p>
            )}
          </div>

          {/* Registration Meta */}
          <div className="detail-card">
            <div className="detail-card-title">Registration Details</div>
            <div className="detail-row">
              <span className="detail-row-label">Registration No.</span>
              <span className="detail-row-value mono">{registration.registrationNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Registered On</span>
              <span className="detail-row-value">
                {new Date(registration.registrationDate).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Safety Acknowledged</span>
              <span className={`detail-row-value ${registration.safetyAcknowledged ? 'detail-check-yes' : 'detail-check-no'}`}>
                {registration.safetyAcknowledged ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Terms Accepted</span>
              <span className={`detail-row-value ${registration.termsAccepted ? 'detail-check-yes' : 'detail-check-no'}`}>
                {registration.termsAccepted ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Email Sent</span>
              <span className={`detail-row-value ${registration.emailSent ? 'detail-check-yes' : 'detail-check-no'}`}>
                {registration.emailSent ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          </div>
          <div className="detail-card">
  <div className="detail-card-title">Vehicle Documents</div>
  <div className="detail-image-grid">
    <div className="detail-image-wrapper">
      <div className="detail-image-label">Vehicle Registration</div>
      {vehicle?.uploads?.vehicleRegistration ? (
        <img
          src={getImageUrl(vehicle.uploads.vehicleRegistration)}
          alt="Vehicle Registration"
          onClick={() => window.open(getImageUrl(vehicle.uploads.vehicleRegistration), '_blank')}
        />
      ) : (
        <div style={{ color: '#535653', padding: '1rem', fontSize: '0.8rem' }}>Not uploaded</div>
      )}
    </div>
     <div className="detail-image-wrapper">
      <div className="detail-image-label">Vehicle Photos</div>
      {vehicle?.uploads?.vehiclePhotos?.length > 0 ? (
        vehicle.uploads.vehiclePhotos.map((photo, index) => (
          <img
            key={index}
            src={getImageUrl(photo)}
            alt={`Vehicle photo ${index + 1}`}
            onClick={() => window.open(getImageUrl(photo), '_blank')}
          />
        ))
      ) : (
        <div style={{ color: '#535653', padding: '1rem', fontSize: '0.8rem' }}>No photos uploaded</div>
      )}
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}