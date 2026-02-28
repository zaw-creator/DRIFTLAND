"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./success.module.css";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const registrationNumber = searchParams.get("registrationNumber");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>Registration Submitted!</h1>

        <div className={styles.info}>
          <p className={styles.registrationNumber}>
            Registration Number: <strong>{registrationNumber}</strong>
          </p>
          <p className={styles.status}>
            Status: <span className={styles.pending}>Pending Verification</span>
          </p>
        </div>

        <div className={styles.message}>
          <h2>What's Next?</h2>
          <ol>
            <li>
              <strong>Check Your Email</strong>
              <br />
              We've sent you a confirmation email with a magic link to view and
              edit your registration.
            </li>
            <li>
              <strong>Wait for Verification</strong>
              <br />
              Our team will review your registration. You'll receive another
              email once approved.
            </li>
            <li>
              <strong>Get Your QR Code</strong>
              <br />
              Once verified, you'll receive your event QR code and payment
              instructions via email.
            </li>
          </ol>
        </div>

        <div className={styles.actions}>
          <Link href="/register" className={styles.primaryButton}>
            Register Another Driver
          </Link>
          <Link href="/registration/lookup" className={styles.secondaryButton}>
            Check Registration Status
          </Link>
        </div>

        <div className={styles.importantNote}>
          <strong>Important:</strong> Save your registration number (
          {registrationNumber}). You'll need it to check your status or make
          changes.
        </div>
      </div>
    </div>
  );
}
