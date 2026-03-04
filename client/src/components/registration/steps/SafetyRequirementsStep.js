"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./SafetyRequirementsStep.module.css";

export default function SafetyRequirementsStep({
  data,
  onChange,
  onValidation,
  onSubmit,
  onBack,
  isSubmitting,
  submitButtonText = "Submit Registration",
}) {
  const [requirements, setRequirements] = useState({
    safetyWear: [],
    carComponents: [],
    termsConditions: [],
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [scrollStatus, setScrollStatus] = useState({
    safetyWear: false,
    carComponents: false,
    termsConditions: false,
  });

  const safetyWearRef = useRef(null);
  const carComponentsRef = useRef(null);
  const termsConditionsRef = useRef(null);

  useEffect(() => {
    fetchRequirements();
  }, []);

  useEffect(() => {
    validateForm();
  }, [data, scrollStatus]);

  const fetchRequirements = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/safety-requirements`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch safety requirements");
      }
      const result = await response.json();

      // API returns result.data as an object with safetyWear, carComponents, termsConditions
      setRequirements({
        safetyWear: result.data.safetyWear?.items || [],
        carComponents: result.data.carComponents?.items || [],
        termsConditions: result.data.termsConditions?.items || [],
      });
    } catch (error) {
      console.error("Error fetching requirements:", error);
      setErrors({
        fetch: "Failed to load safety requirements. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!scrollStatus.safetyWear) {
      newErrors.safetyWear =
        "Please scroll through all safety wear requirements";
    } else if (!data.safetyWearAck) {
      newErrors.safetyWear = "Please acknowledge safety wear requirements";
    }

    if (!scrollStatus.carComponents) {
      newErrors.carComponents =
        "Please scroll through all car component requirements";
    } else if (!data.carComponentsAck) {
      newErrors.carComponents = "Please acknowledge car component requirements";
    }

    if (!scrollStatus.termsConditions) {
      newErrors.termsConditions =
        "Please scroll through all terms and conditions";
    } else if (!data.termsConditionsAck) {
      newErrors.termsConditions = "Please accept terms and conditions";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidation(isValid, newErrors);
    return isValid;
  };

  const handleScroll = (category, ref) => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const isScrolledToEnd = scrollTop + clientHeight >= scrollHeight - 10;

      if (isScrolledToEnd && !scrollStatus[category]) {
        setScrollStatus((prev) => ({ ...prev, [category]: true }));
      }
    }
  };

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      onSubmit();
    } else {
      // Show alert with what needs to be completed
      const errorMessages = [];
      if (!scrollStatus.safetyWear) {
        errorMessages.push("- Scroll through Safety Wear requirements");
      } else if (!data.safetyWearAck) {
        errorMessages.push("- Acknowledge Safety Wear requirements");
      }

      if (!scrollStatus.carComponents) {
        errorMessages.push("- Scroll through Car Component requirements");
      } else if (!data.carComponentsAck) {
        errorMessages.push("- Acknowledge Car Component requirements");
      }

      if (!scrollStatus.termsConditions) {
        errorMessages.push("- Scroll through Terms and Conditions");
      } else if (!data.termsConditionsAck) {
        errorMessages.push("- Accept Terms and Conditions");
      }

      alert("Please complete the following:\n\n" + errorMessages.join("\n"));

      // Scroll to first error
      if (!scrollStatus.safetyWear || !data.safetyWearAck) {
        safetyWearRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (!scrollStatus.carComponents || !data.carComponentsAck) {
        carComponentsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (!scrollStatus.termsConditions || !data.termsConditionsAck) {
        termsConditionsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <div className={styles.step}>
      <h2>Step 4: Safety Requirements & Terms</h2>
      <p className={styles.subtitle}>
        Please review and acknowledge all requirements
      </p>

      {loading ? (
        <div className={styles.loading}>Loading requirements...</div>
      ) : errors.fetch ? (
        <div className={styles.errorBox}>{errors.fetch}</div>
      ) : (
        <>
          {/* Safety Wear Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Safety Wear Requirements</h3>
            <div
              ref={safetyWearRef}
              className={styles.scrollBox}
              onScroll={() => handleScroll("safetyWear", safetyWearRef)}
            >
              <ul className={styles.requirementsList}>
                {requirements.safetyWear.map((item, index) => (
                  <li
                    key={index}
                    className={item.required ? styles.required : ""}
                  >
                    <strong>{item.title}</strong>
                    {item.required && (
                      <span className={styles.badge}>REQUIRED</span>
                    )}
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            {!scrollStatus.safetyWear && (
              <p className={styles.scrollHint}>
                ↓ Scroll to the bottom to enable checkbox
              </p>
            )}
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={data.safetyWearAck}
                onChange={(e) =>
                  handleChange("safetyWearAck", e.target.checked)
                }
                disabled={!scrollStatus.safetyWear}
              />
              <span>
                I acknowledge and will comply with all safety wear requirements
              </span>
            </label>
            {errors.safetyWear && (
              <span className={styles.errorText}>{errors.safetyWear}</span>
            )}
          </div>

          {/* Car Components Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Car Component Requirements</h3>
            <div
              ref={carComponentsRef}
              className={styles.scrollBox}
              onScroll={() => handleScroll("carComponents", carComponentsRef)}
            >
              <ul className={styles.requirementsList}>
                {requirements.carComponents.map((item, index) => (
                  <li
                    key={index}
                    className={item.required ? styles.required : ""}
                  >
                    <strong>{item.title}</strong>
                    {item.required && (
                      <span className={styles.badge}>REQUIRED</span>
                    )}
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            {!scrollStatus.carComponents && (
              <p className={styles.scrollHint}>
                ↓ Scroll to the bottom to enable checkbox
              </p>
            )}
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={data.carComponentsAck}
                onChange={(e) =>
                  handleChange("carComponentsAck", e.target.checked)
                }
                disabled={!scrollStatus.carComponents}
              />
              <span>
                I acknowledge my vehicle meets all required specifications
              </span>
            </label>
            {errors.carComponents && (
              <span className={styles.errorText}>{errors.carComponents}</span>
            )}
          </div>

          {/* Terms and Conditions Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Terms and Conditions</h3>
            <div
              ref={termsConditionsRef}
              className={styles.scrollBox}
              onScroll={() =>
                handleScroll("termsConditions", termsConditionsRef)
              }
            >
              <ul className={styles.requirementsList}>
                {requirements.termsConditions.map((item, index) => (
                  <li key={index}>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            {!scrollStatus.termsConditions && (
              <p className={styles.scrollHint}>
                ↓ Scroll to the bottom to enable checkbox
              </p>
            )}
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={data.termsConditionsAck}
                onChange={(e) =>
                  handleChange("termsConditionsAck", e.target.checked)
                }
                disabled={!scrollStatus.termsConditions}
              />
              <span>I have read and agree to all terms and conditions</span>
            </label>
            {errors.termsConditions && (
              <span className={styles.errorText}>{errors.termsConditions}</span>
            )}
          </div>
        </>
      )}

      <div className={styles.actions}>
        <button
          onClick={onBack}
          className={styles.backButton}
          disabled={isSubmitting}
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </button>
      </div>
    </div>
  );
}
