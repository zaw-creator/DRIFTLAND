"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import GlitchBackground from "@/components/GlitchBackground";
import { Analytics } from "@vercel/analytics/next"

export default function HomePage() {
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?status=upcoming`)
      .then((r) => r.json())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setEventInfo(result.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.container}>
      <GlitchBackground />
      <Analytics/>

      <div className={styles.content}>

        <div className={styles.brand}>
          <p className={styles.brandName}>
            DRIFT<span className={styles.brandAccent}>LAND</span>
           <br />
            154
          </p>
          <p className={styles.brandSub}>PRESENTS</p>
        </div>

        {eventInfo && (
          <div className={styles.eventInfo}>
            <p className={styles.eventName}>{eventInfo.name}</p>
           <div className={styles.eventMeta}>
  <div className={styles.metaItem}>
  <span className={styles.metaLabel}>EVENT DATES</span>
  <span className={styles.metaValue}>
    SAT 28 — SUN 29 MARCH 2026
  </span>
</div>
  <div className={styles.metaDivider} />
  <div className={styles.metaItem}>
    <span className={styles.metaLabel}>REGISTRATION CLOSES</span>
    <span className={styles.metaValue}>
      {new Date(eventInfo.registrationDeadline).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>
  </div>
  <div className={styles.metaDivider} />
  <div className={styles.metaItem}>
    <span className={styles.metaLabel}>LOCATION</span>
    <span className={styles.metaValue}>{eventInfo.location}</span>
  </div>
</div>
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/register" className={styles.primaryBtn}>
            REGISTER NOW
          </Link>
          <Link href="/registration/lookup" className={styles.secondaryBtn}>
            CHECK REGISTRATION
          </Link>
        </div>

        {eventInfo && (
          <p className={styles.spots}>
            <span className={styles.spotsCount}>
              {eventInfo.capacity - eventInfo.registeredCount}
            </span>{" "}
            spots remaining
          </p>
        )}
      </div>
    </div>
  );
}