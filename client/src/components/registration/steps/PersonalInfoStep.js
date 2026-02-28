"use client";

import { useState, useEffect } from "react";
import {
  validateEmail,
  validatePhone,
  validateAge,
  validateLicenseExpiry,
} from "../../../utils/validation";
import FileUpload from "../fields/FileUpload";
import styles from "./PersonalInfoStep.module.css";

export default function PersonalInfoStep({
  data,
  onChange,
  onValidation,
  onNext,
}) {
  const [errors, setErrors] = useState({});
  const [showAgeWarning, setShowAgeWarning] = useState(false);

  useEffect(() => {
    validateForm();
  }, [data]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.fullName || data.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePhone(data.phone)) {
      newErrors.phone =
        "Please enter a valid phone number (e.g., +959XXXXXXXXX)";
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else if (!validateAge(data.dateOfBirth)) {
      if (!showAgeWarning) {
        setShowAgeWarning(true);
      }
    }

    if (!data.licenseNumber) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!data.licenseExpiry) {
      newErrors.licenseExpiry = "License expiry date is required";
    } else if (!validateLicenseExpiry(data.licenseExpiry)) {
      newErrors.licenseExpiry = "Driver license has expired";
    }

    if (!data.address) {
      newErrors.address = "Address is required";
    }

    if (!data.emergencyContact.name) {
      newErrors.emergencyContactName = "Emergency contact name is required";
    }

    if (!data.emergencyContact.phone) {
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    }

    if (!data.uploads.driverLicense) {
      newErrors.driverLicense = "Driver license photo is required";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidation(isValid, newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleEmergencyContactChange = (field, value) => {
    onChange({
      emergencyContact: {
        ...data.emergencyContact,
        [field]: value,
      },
    });
  };

  const handleMedicalInfoChange = (field, value) => {
    onChange({
      medicalInfo: {
        ...data.medicalInfo,
        [field]: value,
      },
    });
  };

  const handleFileChange = (field, file) => {
    onChange({
      uploads: {
        ...data.uploads,
        [field]: file,
      },
    });
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleAgeWarningAccept = () => {
    setShowAgeWarning(false);
  };

  return (
    <div className={styles.step}>
      <h2>Step 1: Personal Information</h2>
      <p className={styles.subtitle}>Please provide your personal details</p>

      {showAgeWarning && (
        <div className={styles.ageWarning}>
          <h3>Age Requirement Notice</h3>
          <p>
            Participants must be 18 years or older. If this is a mistake, please
            correct your date of birth.
          </p>
          <button
            onClick={handleAgeWarningAccept}
            className={styles.warningButton}
          >
            I Understand, Continue
          </button>
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? styles.error : ""}
          />
          {errors.fullName && (
            <span className={styles.errorText}>{errors.fullName}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Email Address *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your.email@example.com"
            className={errors.email ? styles.error : ""}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number *</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+959XXXXXXXXX"
            className={errors.phone ? styles.error : ""}
          />
          {errors.phone && (
            <span className={styles.errorText}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Date of Birth *</label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className={errors.dateOfBirth ? styles.error : ""}
          />
          {errors.dateOfBirth && (
            <span className={styles.errorText}>{errors.dateOfBirth}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Driver License Number *</label>
          <input
            type="text"
            value={data.licenseNumber}
            onChange={(e) =>
              handleChange("licenseNumber", e.target.value.toUpperCase())
            }
            placeholder="ABC123456"
            className={errors.licenseNumber ? styles.error : ""}
          />
          {errors.licenseNumber && (
            <span className={styles.errorText}>{errors.licenseNumber}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>License Expiry Date *</label>
          <input
            type="date"
            value={data.licenseExpiry}
            onChange={(e) => handleChange("licenseExpiry", e.target.value)}
            className={errors.licenseExpiry ? styles.error : ""}
          />
          {errors.licenseExpiry && (
            <span className={styles.errorText}>{errors.licenseExpiry}</span>
          )}
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Address *</label>
          <textarea
            value={data.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter your full address"
            rows="3"
            className={errors.address ? styles.error : ""}
          />
          {errors.address && (
            <span className={styles.errorText}>{errors.address}</span>
          )}
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Emergency Contact</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Contact Name *</label>
          <input
            type="text"
            value={data.emergencyContact.name}
            onChange={(e) =>
              handleEmergencyContactChange("name", e.target.value)
            }
            placeholder="Emergency contact name"
            className={errors.emergencyContactName ? styles.error : ""}
          />
          {errors.emergencyContactName && (
            <span className={styles.errorText}>
              {errors.emergencyContactName}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Contact Phone *</label>
          <input
            type="tel"
            value={data.emergencyContact.phone}
            onChange={(e) =>
              handleEmergencyContactChange("phone", e.target.value)
            }
            placeholder="+959XXXXXXXXX"
            className={errors.emergencyContactPhone ? styles.error : ""}
          />
          {errors.emergencyContactPhone && (
            <span className={styles.errorText}>
              {errors.emergencyContactPhone}
            </span>
          )}
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Medical Information</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Blood Type</label>
          <select
            value={data.medicalInfo.bloodType}
            onChange={(e) =>
              handleMedicalInfoChange("bloodType", e.target.value)
            }
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Allergies</label>
          <input
            type="text"
            value={data.medicalInfo.allergies}
            onChange={(e) =>
              handleMedicalInfoChange("allergies", e.target.value)
            }
            placeholder="Any allergies (optional)"
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Other Medical Conditions</label>
          <textarea
            value={data.medicalInfo.otherConditions}
            onChange={(e) =>
              handleMedicalInfoChange("otherConditions", e.target.value)
            }
            placeholder="Any other medical conditions we should know about (optional)"
            rows="2"
          />
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Document Uploads</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Driver License Photo *</label>
          <FileUpload
            file={data.uploads.driverLicense}
            onChange={(file) => handleFileChange("driverLicense", file)}
            accept="image/*,.pdf"
            maxSize={5}
          />
          {errors.driverLicense && (
            <span className={styles.errorText}>{errors.driverLicense}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Profile Photo (Optional)</label>
          <FileUpload
            file={data.uploads.profilePhoto}
            onChange={(file) => handleFileChange("profilePhoto", file)}
            accept="image/*"
            maxSize={5}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleNext} className={styles.nextButton}>
          Next Step →
        </button>
      </div>
    </div>
  );
}
