// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (E.164 format)
export function validatePhone(phone) {
  // Accepts formats like +959XXXXXXXXX or +1XXXXXXXXXX
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// Age validation (must be 18+)
export function validateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 18;
  }

  return age >= 18;
}

// Calculate age
export function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// License expiry validation (must be future date)
export function validateLicenseExpiry(expiryDate) {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return expiry >= today;
}

// Myanmar vehicle registration validation (format: AA-1234)
export function validateVehicleRegistration(registrationNumber) {
  const myanmarRegex = /^[0-9A-Z]{2}-[0-9]{4}$/;
  return myanmarRegex.test(registrationNumber);
}

// Vehicle year validation (1990 to current year)
export function validateVehicleYear(year) {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  return yearNum >= 1990 && yearNum <= currentYear;
}
