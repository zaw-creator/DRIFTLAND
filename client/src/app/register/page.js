"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PersonalInfoStep from "@/components/registration/steps/PersonalInfoStep";
import VehicleInfoStep from "@/components/registration/steps/VehicleInfoStep";
import EventSelectionStep from "@/components/registration/steps/EventSelectionStep";
import SafetyRequirementsStep from "@/components/registration/steps/SafetyRequirementsStep";
import FormProgress from "@/components/registration/FormProgress";
import styles from "./register.module.css";
import GlitchBackground from "@/components/GlitchBackground";
import { Suspense } from "react";

const TOTAL_STEPS = 4;
const STORAGE_KEY = "driftland_registration_draft";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if we're in edit mode
  const editRegistrationId = searchParams.get("edit");
  const editToken = searchParams.get("token");
  const isEditMode = !!(editRegistrationId && editToken);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loadingExistingData, setLoadingExistingData] = useState(isEditMode);
  const [existingEvent, setExistingEvent] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    licenseNumber: "",
    licenseExpiry: "",
    address: "",
    emergencyContact: { name: "", phone: "" },
    medicalInfo: { bloodType: "", allergies: "", otherConditions: "" },
    uploads: {
      driverLicense: null,
      profilePhoto: null,
      vehicleRegistration: null,
      vehiclePhotos: [],
    },
    // Vehicle Info
    make: "",
    model: "",
    year: "",
    registrationNumber: "",
    engineSpec: "",
    color: "",

    // Event Selection
    eventId: "",
    driveType: "",
    hasExperience: false,
    specialRequirements: "",
    // Safety Acknowledgments
    safetyWearAck: false,
    carComponentsAck: false,
    termsConditionsAck: false,
  });

  const [validation, setValidation] = useState({
    errors: {},
    isValid: false,
  });

  // Helper function to save data to localStorage
  const saveToLocalStorage = (data, step) => {
    try {
      // Create a copy of formData without file objects (can't serialize files)
      const dataToSave = {
        ...data,
        uploads: {
          driverLicense: null,
          profilePhoto: null,
          vehicleRegistration: null,
          vehiclePhotos: [],
        },
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          formData: dataToSave,
          currentStep: step,
          timestamp: new Date().toISOString(),
        }),
      );
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      // localStorage might be full or disabled
    }
  };

  // Layer 1: Debounced auto-save (saves 2 seconds after user stops typing)
  // This captures active user input and saves shortly after they finish typing
  useEffect(() => {
    if (currentStep < 4) {
      const debounceTimer = setTimeout(() => {
        saveToLocalStorage(formData, currentStep);
      }, 2000); // 2 seconds after last change

      return () => clearTimeout(debounceTimer);
    }
  }, [formData, currentStep]);

  // Layer 2: Save on tab switch/hide (visibilitychange event)
  // Catches: tab switches, minimize, app switching, mobile background

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentStep < 4) {
        saveToLocalStorage(formData, currentStep);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [formData, currentStep]);

  // Load saved data on mount (SILENT RESTORE - no confirmation)
  // Skip restore if in edit mode
  useEffect(() => {
    if (isEditMode) return; // Don't restore from localStorage in edit mode

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        // Check if saved data is recent (within 7 days)
        const savedTime = parsed.timestamp ? new Date(parsed.timestamp) : null;
        const daysSinceSave = savedTime
          ? (Date.now() - savedTime.getTime()) / (1000 * 60 * 60 * 24)
          : 999;

        if (daysSinceSave < 7) {
          // Silently restore data without confirmation
          setFormData({
            ...parsed.formData,
            uploads: {
              driverLicense: null,
              profilePhoto: null,
              vehicleRegistration: null,
              vehiclePhotos: [],
              
            },
          });
          setCurrentStep(parsed.currentStep);

          console.log(
            "✓ Registration data restored from",
            savedTime?.toLocaleString(),
          );
        } else {
          // Data too old, clear it
          console.log("Clearing old saved data (>7 days)");
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error loading saved data:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []); // Only run once on mount

  // Fetch existing registration data when in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchExistingRegistration = async () => {
      try {
        setLoadingExistingData(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${editRegistrationId}?token=${editToken}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load registration");
        }

        const result = await response.json();
        const reg = result.data;

        // Pre-fill form with existing data
        setFormData({
          // Personal Info
          fullName: reg.driver.fullName || "",
          email: reg.driver.email || "",
          phone: reg.driver.phone || "",
          dateOfBirth: reg.driver.dateOfBirth
            ? new Date(reg.driver.dateOfBirth).toISOString().split("T")[0]
            : "",
          licenseNumber: reg.driver.licenseNumber || "",
          licenseExpiry: reg.driver.licenseExpiry
            ? new Date(reg.driver.licenseExpiry).toISOString().split("T")[0]
            : "",
          address: reg.driver.address || "",
          emergencyContact: reg.driver.emergencyContact || {
            name: "",
            phone: "",
          },
          medicalInfo: reg.driver.medicalInfo || {
            bloodType: "",
            allergies: "",
            otherConditions: "",
          },
          uploads: {
            driverLicense: null,
            profilePhoto: null,
            vehicleRegistration: null,
            vehiclePhotos: [],
          },
          // Vehicle Info
          make: reg.vehicle.make || "",
          model: reg.vehicle.model || "",
          year: reg.vehicle.year || "",
          registrationNumber: reg.vehicle.registrationNumber || "",
          engineSpec: reg.vehicle.engineSpec || "",
          color: reg.vehicle.color || "",
          // Event Selection (read-only in edit mode)
          eventId: reg.event._id || "",
          driveType: reg.driveType || "",
          hasExperience: reg.previousExperience || false,
          specialRequirements: reg.specialRequirements || "",
          // Safety Acknowledgments
          safetyWearAck: false,
          carComponentsAck: false,
          termsConditionsAck: false,
          existingUploads: {
    driverLicense: reg.driver.uploads?.driverLicense
      ? `${process.env.NEXT_PUBLIC_API_URL}/${reg.driver.uploads.driverLicense.replace(/\\/g, '/')}`
      : null,
    profilePhoto: reg.driver.uploads?.profilePhoto
      ? `${process.env.NEXT_PUBLIC_API_URL}/${reg.driver.uploads.profilePhoto.replace(/\\/g, '/')}`
      : null,
  },
        });

        // Store event info for read-only display
        setExistingEvent(reg.event);
      } catch (error) {
        console.error("Error fetching registration:", error);
        alert(`Error: ${error.message}. Redirecting to lookup page.`);
        router.push("/registration/lookup");
      } finally {
        setLoadingExistingData(false);
      }
    };

    fetchExistingRegistration();
  }, [isEditMode, editRegistrationId, editToken]);

  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const updateValidation = (isValid, errors = {}) => {
    setValidation({ errors, isValid });
  };
  //Next Handlers
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  //Back handlers
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (isEditMode) {
  const submitData = new FormData();

  const driverData = {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    dateOfBirth: formData.dateOfBirth,
    licenseNumber: formData.licenseNumber,
    licenseExpiry: formData.licenseExpiry,
    address: formData.address,
    emergencyContact: formData.emergencyContact,
    medicalInfo: formData.medicalInfo,
  };

  const vehicleData = {
    make: formData.make,
    model: formData.model,
    year: formData.year,
    registrationNumber: formData.registrationNumber,
    engineSpec: formData.engineSpec,
    color: formData.color,
  };

  const registrationData = {
    driveType: formData.driveType,
    previousExperience: formData.hasExperience,
    specialRequirements: formData.specialRequirements,
  };

  submitData.append('driver', JSON.stringify(driverData));
  submitData.append('vehicle', JSON.stringify(vehicleData));
  submitData.append('registration', JSON.stringify(registrationData));

  // Append files only if new ones were selected
  if (formData.uploads.driverLicense) {
    submitData.append('driverLicense', formData.uploads.driverLicense);
  }
  if (formData.uploads.profilePhoto) {
    submitData.append('profilePhoto', formData.uploads.profilePhoto);
  }
  if (formData.uploads.vehicleRegistration) {
    submitData.append('vehicleRegistration', formData.uploads.vehicleRegistration);
  }
  if (formData.uploads.vehiclePhotos.length > 0) {
    formData.uploads.vehiclePhotos.forEach((photo) => {
      submitData.append('vehiclePhotos', photo);
    });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${editRegistrationId}?token=${editToken}`,
    {
      method: 'PUT',
      body: submitData, // No Content-Type header — let browser set it with boundary
    }
  );

  const result = await response.json();

  if (response.ok) {
    alert('Registration updated successfully!');
    router.push(`/registration/${editRegistrationId}?token=${editToken}`);
  } else {
    throw new Error(result.error || 'Update failed');
  }
}
      else {
        // CREATE MODE: Send FormData with files
        const submitData = new FormData();

        // Group data into nested structure that backend expects
        const driverData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          licenseNumber: formData.licenseNumber,
          licenseExpiry: formData.licenseExpiry,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          medicalInfo: formData.medicalInfo,
        };

        const vehicleData = {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          registrationNumber: formData.registrationNumber,
          engineSpec: formData.engineSpec,
          color: formData.color,
        };

        const registrationData = {
          eventId: formData.eventId,
          driveType: formData.driveType,
          hasExperience: formData.hasExperience,
          specialRequirements: formData.specialRequirements,
        };

        // Append nested data as JSON strings
        submitData.append("driver", JSON.stringify(driverData));
        submitData.append("vehicle", JSON.stringify(vehicleData));
        submitData.append("registration", JSON.stringify(registrationData));
        submitData.append(
          "safetyAcknowledged",
          formData.safetyWearAck && formData.carComponentsAck,
        );
        submitData.append("termsAccepted", formData.termsConditionsAck);

        // Append files
        if (formData.uploads.driverLicense) {
          submitData.append("driverLicense", formData.uploads.driverLicense);
        }
        if (formData.uploads.profilePhoto) {
          submitData.append("profilePhoto", formData.uploads.profilePhoto);
        }
        if (formData.uploads.vehicleRegistration) {
          submitData.append(
            "vehicleRegistration",
            formData.uploads.vehicleRegistration,
          );
        }
        if (formData.uploads.vehiclePhotos.length > 0) {
          formData.uploads.vehiclePhotos.forEach((photo) => {
            submitData.append("vehiclePhotos", photo);
          });
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/registrations`,
          {
            method: "POST",
            body: submitData,
          },
        );

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error(
            "Server returned invalid response. Check console for details.",
          );
        }

        const result = await response.json();
        console.log("Registration response:", result);

        if (response.ok) {
          // Clear saved data
          localStorage.removeItem(STORAGE_KEY);

          // Redirect to success page
          window.location.href = `/register/success?registrationNumber=${result.data.registrationNumber}`;
        } else {
          // Show detailed error message
          const errorMsg = result.message || "Registration failed";
          const errorDetails = result.errors
            ? "\n\nDetails:\n" +
              Object.entries(result.errors)
                .map(([key, val]) => `${key}: ${val}`)
                .join("\n")
            : "";
          throw new Error(errorMsg + errorDetails);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        `Error: ${error.message}. Please check your information and try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching existing registration data
  if (loadingExistingData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Loading Registration...</h1>
        </div>
      </div>
    );
  }

  return (
  <div className={styles.container}>
    <GlitchBackground />
    <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
      
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img src="/logo.png" alt="DriftLand Logo" />
        </div>
        <h1>Driver Registration</h1>
        <p>{isEditMode ? 'Edit your registration' : 'Register for DriftLand Events'}</p>
      </div>

      <FormProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className={styles.formContainer}>
        <div className={styles.formInner}>
          {currentStep === 1 && (
            <PersonalInfoStep
              data={formData}
              onChange={updateFormData}
              onValidation={updateValidation}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <VehicleInfoStep
              data={formData}
              onChange={updateFormData}
              onValidation={updateValidation}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && !isEditMode && (
            <EventSelectionStep
              data={formData}
              onChange={updateFormData}
              onValidation={updateValidation}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && isEditMode && existingEvent && (
            <div className={styles.step}>
              <h2>Step 3: Event Information</h2>
              <p className={styles.subtitle}>Event cannot be changed after registration</p>
              <div className={styles.eventCard}>
                <h3>{existingEvent.name}</h3>
                <p><strong>Date:</strong>{" "}{new Date(existingEvent.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                <p><strong>Location:</strong> {existingEvent.location}</p>
                <p><strong>Description:</strong> {existingEvent.description}</p>
              </div>
              <div className={styles.formGroup}>
                <label>Drive Type *</label>
                <select value={formData.driveType} onChange={(e) => updateFormData({ driveType: e.target.value })}>
                  <option value="">-- Select drive type --</option>
                  {existingEvent.driveTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input type="checkbox" checked={formData.hasExperience} onChange={(e) => updateFormData({ hasExperience: e.target.checked })} />
                  I have previous drift/track experience
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>Special Requirements (Optional)</label>
                <textarea value={formData.specialRequirements} onChange={(e) => updateFormData({ specialRequirements: e.target.value })} placeholder="Any special requirements or notes..." rows="3" />
              </div>
              <div className={styles.navigation}>
                <button type="button" onClick={handleBack} className={styles.backButton}>Back</button>
                <button type="button" onClick={handleNext} className={styles.nextButton}>Next</button>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <SafetyRequirementsStep
              data={formData}
              onChange={updateFormData}
              onValidation={updateValidation}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              submitButtonText={isEditMode ? "Update Registration" : "Submit Registration"}
            />
          )}
        </div>
      </div>

    </div>
  </div>
);
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#000401', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#535653', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading...</p>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
