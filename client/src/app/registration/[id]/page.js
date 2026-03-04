"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./view.module.css";

export default function ViewRegistrationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const registrationId = params.id;
  const token = searchParams.get("token");

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const getImageUrl = (filePath) => {
  if (!filePath) return null;
  const cleanPath = filePath.replace(/\\/g, '/');
  return `${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`;
};

  useEffect(() => {
    if (registrationId && token) {
      fetchRegistration();
    } else {
      setError("Missing registration ID or access token");
      setLoading(false);
    }
  }, [registrationId, token]);

  const fetchRegistration = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${registrationId}?token=${token}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load registration");
      }

      const result = await response.json();
      setRegistration(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/register?edit=${registrationId}&token=${token}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return styles.verified;
      case "pending":
        return styles.pending;
      case "rejected":
        return styles.rejected;
      case "cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const canEdit =
    registration && registration.event && registration.event.canEdit;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading registration...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/registration/lookup" className={styles.button}>
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Registration Not Found</h2>
          <Link href="/registration/lookup" className={styles.button}>
            Search Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
        <div className={styles.header}>
          <h1>Registration Details</h1>
          <div
            className={`${styles.status} ${getStatusColor(registration.status)}`}
          >
            {registration.status.toUpperCase()}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.regNumber}>
            Registration Number:{" "}
            <strong>{registration.registrationNumber}</strong>
          </div>
        </div>

        {registration.status === "verified" && registration.qrCode && (
          <div className={styles.qrSection}>
            <h2>Event QR Code</h2>
            <img
              src={registration.qrCode}
              alt="Event QR Code"
              className={styles.qrCode}
            />
            <p className={styles.qrHint}>
              Present this QR code at the event check-in
            </p>
          </div>
        )}

        <div className={styles.section}>
          <h2>Personal Information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Full Name</label>
              <p>{registration.driver.fullName}</p>
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <p>{registration.driver.email}</p>
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <p>{registration.driver.phone}</p>
            </div>
            <div className={styles.field}>
              <label>Date of Birth</label>
              <p>
                {new Date(registration.driver.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.section}>
  <h2>Documents</h2>
  <div className={styles.grid}>
    <div className={styles.field}>
      <label>Driver License</label>
      {registration.driver.uploads?.driverLicense ? (
        <img
          src={getImageUrl(registration.driver.uploads.driverLicense)}
          alt="Driver License"
          style={{ width: '100%', borderRadius: '0.25rem', cursor: 'pointer', marginTop: '0.5rem' }}
          onClick={() => window.open(getImageUrl(registration.driver.uploads.driverLicense), '_blank')}
        />
      ) : (
        <p>Not uploaded</p>
      )}
    </div>
    <div className={styles.field}>
      <label>Profile Photo</label>
      {registration.driver.uploads?.profilePhoto ? (
        <img
          src={getImageUrl(registration.driver.uploads.profilePhoto)}
          alt="Profile Photo"
          style={{ width: '100%', borderRadius: '0.25rem', cursor: 'pointer', marginTop: '0.5rem' }}
          onClick={() => window.open(getImageUrl(registration.driver.uploads.profilePhoto), '_blank')}
        />
      ) : (
        <p>Not uploaded</p>
      )}
    </div>
  </div>
</div>

        <div className={styles.section}>
          <h2>Vehicle Information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Make & Model</label>
              <p>
                {registration.vehicle.make} {registration.vehicle.model}
              </p>
            </div>
            <div className={styles.field}>
              <label>Year</label>
              <p>{registration.vehicle.year}</p>
            </div>
            <div className={styles.field}>
              <label>Registration Number</label>
              <p>{registration.vehicle.registrationNumber}</p>
            </div>
            <div className={styles.field}>
              <label>Color</label>
              <p>{registration.vehicle.color || "N/A"}</p>
            </div>
          </div>
          
        </div>

        

        
        
        

        <div className={styles.section}>
          <h2>Event Information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Event Name</label>
              <p>{registration.event.name}</p>
            </div>
            <div className={styles.field}>
              <label>Event Date</label>
              <p>
                {new Date(registration.event.eventDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>
            <div className={styles.field}>
              <label>Location</label>
              <p>{registration.event.location}</p>
            </div>
            <div className={styles.field}>
              <label>Drive Type</label>
              <p>{registration.driveType}</p>
            </div>
          </div>
        </div>

        {registration.status === "verified" && (
          <div className={styles.paymentInfo}>
            <h3>Payment Instructions</h3>
            <p>Please complete payment within 7 days to confirm your spot:</p>
            <ul>
              <li>Bank: [Bank Name]</li>
              <li>Account: [Account Number]</li>
              <li>Amount: [Amount]</li>
              <li>Reference: {registration.registrationNumber}</li>
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {canEdit && (
            <button onClick={handleEdit} className={styles.editButton}>
              Edit Registration
            </button>
          )}
          <Link href="/registration/lookup" className={styles.secondaryButton}>
            Search Another Registration
          </Link>
        </div>

        {!canEdit && registration.status === "pending" && (
          <div className={styles.note}>
            <strong>Note:</strong> You can edit your registration until 24 hours
            before the event starts.
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
