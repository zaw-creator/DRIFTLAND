"use client";

import { useState, useEffect } from "react";
import FileUpload from "../fields/FileUpload";
import {
  validateVehicleRegistration,
  validateVehicleYear,
} from "../../../utils/validation";
import styles from "./VehicleInfoStep.module.css";

export default function VehicleInfoStep({
  data,
  onChange,
  onValidation,
  onNext,
  onBack,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateForm();
  }, [data]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.make) {
      newErrors.make = "Vehicle make is required";
    }

    if (!data.model) {
      newErrors.model = "Vehicle model is required";
    }

    if (!data.year) {
      newErrors.year = "Vehicle year is required";
    } else if (!validateVehicleYear(data.year)) {
      newErrors.year = "Vehicle year must be between 1990 and current year";
    }

    if (!data.registrationNumber) {
      newErrors.registrationNumber = "Registration number is required";
    } else if (!validateVehicleRegistration(data.registrationNumber)) {
      newErrors.registrationNumber = "Invalid format. Must be like: AA-1234";
    }

    if (!data.uploads.vehicleRegistration) {
      newErrors.vehicleRegistration =
        "Vehicle registration document is required";
    }

    if (data.uploads.vehiclePhotos.length === 0) {
      newErrors.vehiclePhotos = "At least 1 vehicle photo is required";
    } else if (data.uploads.vehiclePhotos.length > 3) {
      newErrors.vehiclePhotos = "Maximum 3 vehicle photos allowed";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidation(isValid, newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleFileChange = (field, file) => {
    onChange({
      uploads: {
        ...data.uploads,
        [field]: file,
      },
    });
  };

  const handleVehiclePhotosChange = (files) => {
    onChange({
      uploads: {
        ...data.uploads,
        vehiclePhotos: files,
      },
    });
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className={styles.step}>
      <h2>Step 2: Vehicle Information</h2>
      <p className={styles.subtitle}>Tell us about your vehicle</p>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Vehicle Make *</label>
          <input
            type="text"
            value={data.make}
            onChange={(e) => handleChange("make", e.target.value)}
            placeholder="e.g., Toyota, Nissan, BMW"
            className={errors.make ? styles.error : ""}
          />
          {errors.make && (
            <span className={styles.errorText}>{errors.make}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Vehicle Model *</label>
          <input
            type="text"
            value={data.model}
            onChange={(e) => handleChange("model", e.target.value)}
            placeholder="e.g., AE86, Silvia, M3"
            className={errors.model ? styles.error : ""}
          />
          {errors.model && (
            <span className={styles.errorText}>{errors.model}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Vehicle Year *</label>
          <input
            type="number"
            value={data.year}
            onChange={(e) => handleChange("year", e.target.value)}
            placeholder="e.g., 2020"
            min="1990"
            max={new Date().getFullYear()}
            className={errors.year ? styles.error : ""}
          />
          {errors.year && (
            <span className={styles.errorText}>{errors.year}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Registration Number *</label>
          <input
            type="text"
            value={data.registrationNumber}
            onChange={(e) =>
              handleChange("registrationNumber", e.target.value.toUpperCase())
            }
            placeholder="AA-1234"
            maxLength={7}
            className={errors.registrationNumber ? styles.error : ""}
          />
          {errors.registrationNumber && (
            <span className={styles.errorText}>
              {errors.registrationNumber}
            </span>
          )}
          <small className={styles.helpText}>
            Format: AA-1234 (2 characters + 4 digits)
          </small>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Engine Specification</label>
          <input
            type="text"
            value={data.engineSpec}
            onChange={(e) => handleChange("engineSpec", e.target.value)}
            placeholder="e.g., 2.0L Turbo, 3.5L V6"
          />
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Vehicle Documents & Photos</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Vehicle Registration Document *</label>
          <FileUpload
            file={data.uploads.vehicleRegistration}
            onChange={(file) => handleFileChange("vehicleRegistration", file)}
            accept="image/*,.pdf"
            maxSize={5}
          />
          {errors.vehicleRegistration && (
            <span className={styles.errorText}>
              {errors.vehicleRegistration}
            </span>
          )}
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Vehicle Photos * (1-3 photos)</label>
          <FileUpload
            files={data.uploads.vehiclePhotos}
            onChange={handleVehiclePhotosChange}
            accept="image/*"
            maxSize={5}
            multiple
            maxFiles={3}
          />
          {errors.vehiclePhotos && (
            <span className={styles.errorText}>{errors.vehiclePhotos}</span>
          )}
          <small className={styles.helpText}>
            Upload 1-3 clear photos of your vehicle
          </small>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back
        </button>
        <button onClick={handleNext} className={styles.nextButton}>
          Next Step →
        </button>
      </div>
    </div>
  );
}
