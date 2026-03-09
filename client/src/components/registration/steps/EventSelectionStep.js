"use client";

import { useState, useEffect } from "react";
import styles from "./EventSelectionStep.module.css";

const categoryOptions = {
  Drift: [
    { value: 'Class A', label: 'Class A', desc: 'Recommended for Pros/Champions/OldSkoolz' },
    { value: 'Class B', label: 'Class B', desc: 'Recommended for Advanced drifters/OldSkoolz' },
    { value: 'Class C', label: 'Class C', desc: 'Recommended for New drifters/Beginners' },
  ],
  'Time Attack': [
    { value: 'Class RWD', label: 'Class RWD', desc: 'Rear Wheel Drive' },
    { value: 'Class AWD', label: 'Class AWD', desc: 'All Wheel Drive' },
    { value: 'Class FWD', label: 'Class FWD', desc: 'Front Wheel Drive' },
  ],
  Both: [
    { value: 'Class A', label: 'Class A (Drift)', desc: 'Recommended for Pros/Champions/OldSkoolz' },
    { value: 'Class B', label: 'Class B (Drift)', desc: 'Recommended for Advanced drifters/OldSkoolz' },
    { value: 'Class C', label: 'Class C (Drift)', desc: 'Recommended for New drifters/Beginners' },
    { value: 'Class RWD', label: 'Class RWD (Time Attack)', desc: 'Rear Wheel Drive' },
    { value: 'Class AWD', label: 'Class AWD (Time Attack)', desc: 'All Wheel Drive' },
    { value: 'Class FWD', label: 'Class FWD (Time Attack)', desc: 'Front Wheel Drive' },
  ],
};

export default function EventSelectionStep({
  data,
  onChange,
  onValidation,
  onNext,
  onBack,
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    validateForm();
  }, [data]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events?status=upcoming`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const result = await response.json();
      setEvents(result.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrors({ fetch: "Failed to load events. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!data.eventId) {
      newErrors.eventId = "Please select an event";
    }

    if (!data.driveType) {
      newErrors.driveType = "Please select a drive type";
    }

if (data.driveType && data.driveType === 'Both') {
  if (!data.driftCategories || data.driftCategories.length === 0) {
    newErrors.driftCategory = "Please select at least one Drift category";
  }
  if (!data.timeAttackCategories || data.timeAttackCategories.length === 0) {
    newErrors.timeAttackCategory = "Please select at least one Time Attack category";
  }
} else if (data.driveType === 'Drift' && (!data.driftCategories || data.driftCategories.length === 0)) {
  newErrors.driftCategory = "Please select at least one Drift category";
} else if (data.driveType === 'Time Attack' && (!data.timeAttackCategories || data.timeAttackCategories.length === 0)) {
  newErrors.timeAttackCategory = "Please select at least one Time Attack category";
}


    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidation(isValid, newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const selectedEvent = events.find((e) => e._id === data.eventId);

  return (
    <div className={styles.step}>
      <h2>Step 3: Event Selection</h2>
      <p className={styles.subtitle}>
        Choose the event you want to participate in
      </p>

      {loading ? (
        <div className={styles.loading}>Loading events...</div>
      ) : errors.fetch ? (
        <div className={styles.errorBox}>{errors.fetch}</div>
      ) : (
        <>
          <div className={styles.formGroup}>
            <label>Select Event *</label>
            <select
              value={data.eventId}
              onChange={(e) => handleChange("eventId", e.target.value)}
              className={errors.eventId ? styles.error : ""}
            >
              <option value="">-- Choose an event --</option>
              {events.map((event) => (
                <option
                  key={event._id}
                  value={event._id}
                  disabled={event.isFull}
                >
                  {event.name} -{" "}
                  {new Date(event.eventDate).toLocaleDateString()}
                  {event.isFull
                    ? " (FULL)"
                    : ` (${event.registeredCount}/${event.capacity} spots)`}
                </option>
              ))}
            </select>
            {errors.eventId && (
              <span className={styles.errorText}>{errors.eventId}</span>
            )}
          </div>

          {selectedEvent && (
            <div className={styles.eventDetails}>
              <h3>Event Details</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Available Drive Types:</strong>{" "}
                {selectedEvent.driveTypes.join(", ")}
              </p>
              <p>
                <strong>Registration Deadline:</strong>{" "}
                {new Date(selectedEvent.registrationDeadline).toLocaleDateString()}
              </p>
              <div className={styles.capacityBar}>
                <div
                  className={styles.capacityFill}
                  style={{
                    width: `${(selectedEvent.registeredCount / selectedEvent.capacity) * 100}%`,
                  }}
                ></div>
              </div>
              <p className={styles.capacityText}>
                {selectedEvent.capacity - selectedEvent.registeredCount} spots remaining
              </p>
            </div>
          )}

          {selectedEvent && (
            <div className={styles.formGroup}>
              <label>Drive Type *</label>
              <div className={styles.radioGroup}>
                {selectedEvent.driveTypes.map((type) => (
                  <label key={type} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="driveType"
                      value={type}
                      checked={data.driveType === type}
                    onChange={(e) => {
  handleChange("driveType", e.target.value);
  handleChange("driftCategories", []);
  handleChange("timeAttackCategories", []);
}}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              {errors.driveType && (
                <span className={styles.errorText}>{errors.driveType}</span>
              )}
            </div>
          )}

         {selectedEvent && data.driveType && (
  <>
    {(data.driveType === 'Drift' || data.driveType === 'Both') && (
      <div className={styles.formGroup}>
        <label>Drift Category * (select all that apply)</label>
        <div className={styles.categoryGroup}>
          {categoryOptions['Drift'].map((cat) => (
            <label
              key={cat.value}
              className={`${styles.categoryLabel} ${data.driftCategories?.includes(cat.value) ? styles.categoryActive : ''}`}
            >
              <input
                type="checkbox"
                value={cat.value}
                checked={data.driftCategories?.includes(cat.value) || false}
                onChange={(e) => {
                  const current = data.driftCategories || [];
                  if (e.target.checked) {
                    handleChange("driftCategories", [...current, cat.value]);
                  } else {
                    handleChange("driftCategories", current.filter(c => c !== cat.value));
                  }
                }}
              />
              <div className={styles.categoryContent}>
                <span className={styles.categoryName}>{cat.label}</span>
                <span className={styles.categoryDesc}>{cat.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.driftCategory && (
          <span className={styles.errorText}>{errors.driftCategory}</span>
        )}
      </div>
    )}

    {(data.driveType === 'Time Attack' || data.driveType === 'Both') && (
      <div className={styles.formGroup}>
        <label>Time Attack Category * (select all that apply)</label>
        <div className={styles.categoryGroup}>
          {categoryOptions['Time Attack'].map((cat) => (
            <label
              key={cat.value}
              className={`${styles.categoryLabel} ${data.timeAttackCategories?.includes(cat.value) ? styles.categoryActive : ''}`}
            >
              <input
                type="checkbox"
                value={cat.value}
                checked={data.timeAttackCategories?.includes(cat.value) || false}
                onChange={(e) => {
                  const current = data.timeAttackCategories || [];
                  if (e.target.checked) {
                    handleChange("timeAttackCategories", [...current, cat.value]);
                  } else {
                    handleChange("timeAttackCategories", current.filter(c => c !== cat.value));
                  }
                }}
              />
              <div className={styles.categoryContent}>
                <span className={styles.categoryName}>{cat.label}</span>
                <span className={styles.categoryDesc}>{cat.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.timeAttackCategory && (
          <span className={styles.errorText}>{errors.timeAttackCategory}</span>
        )}
      </div>
    )}
  </>
)}

          <div className={styles.formGroup}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={data.hasExperience}
                onChange={(e) => handleChange("hasExperience", e.target.checked)}
              />
              <span className={styles.checkboxLabel}>
                I have prior drifting/racing experience
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Special Requirements or Notes (Optional)</label>
            <textarea
              value={data.specialRequirements}
              onChange={(e) => handleChange("specialRequirements", e.target.value)}
              placeholder="Any special requirements, dietary restrictions, or notes for the organizers..."
              rows="4"
            />
          </div>
        </>
      )}

      <div className={styles.actions}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back
        </button>
        <button
          onClick={handleNext}
          className={styles.nextButton}
          disabled={loading}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}