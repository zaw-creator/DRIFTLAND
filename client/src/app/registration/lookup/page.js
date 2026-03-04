"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./lookup.module.css";

export default function LookupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    registrationNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/lookup?registrationNumber=${formData.registrationNumber}&email=${formData.email}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration not found");
      }

      const result = await response.json();

      // Redirect to view page with magic token
      // Backend returns: { success: true, data: { registration, magicLink } }
      const registrationId = result.data.registration._id;
      const magicToken = result.data.magicLink.split("token=")[1];
      
      router.push(
        `/registration/${registrationId}?token=${magicToken}`,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className={styles.container}>
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.logoWrapper}>
          <img src="/logo.png" alt="DriftLand Logo" />
        </div>
        <h1 className={styles.title}>Check Registration Status</h1>
        <p className={styles.subtitle}>
          Enter your registration number and email address to view your registration details
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Registration Number</label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => handleChange("registrationNumber", e.target.value.toUpperCase())}
              placeholder="DR-2026-0001"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Searching..." : "View Registration"}
          </button>
        </form>

        <div className={styles.helpText}>
          <p>
            <strong>Can't find your registration number?</strong>
            Check the confirmation email we sent you when you registered.
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
