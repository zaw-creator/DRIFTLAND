"use client";
import { useEffect, useState } from "react";
import styles from "./GlitchBackground.module.css";

export default function GlitchBackground({ staticBg = false }) {
  const [current, setCurrent] = useState(0);
  const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg"];

  useEffect(() => {
    if (staticBg) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [staticBg]);

  if (staticBg) {
    return (
      <div className={styles.wrapper}>
        <div
          className={styles.staticBg}
          style={{ backgroundImage: `url(/bg1.jpg)` }}
        />
        <div className={styles.overlay} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {images.map((src, index) => (
        <div
          key={src}
          className={`${styles.slide} ${index === current ? styles.active : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className={styles.glitch1} style={{ backgroundImage: `url(${images[current]})` }} />
      <div className={styles.glitch2} style={{ backgroundImage: `url(${images[current]})` }} />
      <div className={styles.overlay} />
    </div>
  );
}