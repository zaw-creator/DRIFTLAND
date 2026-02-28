## Spec for Driver Registration with Safety Requirements

## Summary
Implement a multi-step driver registration system for event participants that captures driver information, vehicle details, emergency contacts, and displays mandatory safety requirements including safety wear, car components, and terms & conditions. The system will validate input, store registration data in MongoDB, and provide confirmation with requirements checklist.

## Functional Requirements

### FR1: Driver Registration Form
**WHEN** a user accesses the driver registration page, **THE SYSTEM SHALL** display a multi-step registration form with the following sections:

#### Step 1: Personal Information
- Full Name (required, min 2 characters)
- Email Address (required, valid email format)
- Phone Number (required, valid format with country code)
- Date of Birth (required, must be 18+ years old)
- Driver License Number (required, alphanumeric)
- Driver License Expiry Date (required, must be valid/not expired)
- Address (required)
- Emergency Contact Name (required)
- Emergency Contact Phone (required)

#### Step 2: Vehicle Information
- Vehicle Make (required, dropdown/text)
- Vehicle Model (required)
- Vehicle Year (required, 1990-current year)
- Vehicle Registration Number (required, alphanumeric)

#### Step 3: Event Registration
- Event Selection (required, dropdown populated from database)
- Type of Drive: has to choose (Drift, Time Attack) for the selective event.
**if Drift**
- Competition Class (will be later add by the admin) (default: pending)
- Previous Event Experience (optional, yes/no)
- Special Requirements/Notes (optional, textarea, max 500 characters)

### FR2: Form Validation
**WHEN** a user submits any registration step, **THE SYSTEM SHALL** validate all required fields and display clear error messages for:
- Empty required fields
- Invalid email format
- Invalid phone number format
- Age verification (must be 18+)
- Expired driver license
- Invalid registration number format (Will be Burmese's Registration Number Format)

**IF** validation fails, **THEN THE SYSTEM SHALL** highlight the problematic fields and prevent progression to the next step.

### FR3: Safety Requirements Display
**WHEN** a user successfully completes the registration form, **THE SYSTEM SHALL** display three mandatory information sections before final submission:

#### Section 1: Mandatory Safety Wear
- Fire-Resistant Racing Suit
- Racing Helmet: Must cover the whole face.
- Racing Gloves: Must be closed-finger and long enough to cover the wrist (Minimum).
- Racing Shoes: Must be closed-toe and long enough to cover the ankle. (Minimum) (fire-resistant)

#### Section 2: Must Include Car Components
- Safety Switch
- Roll Cage (or) Full Mirror Sticker
- Hood Pin Lock
- Full Backet Seat
- 4 Point Racing Seat Belt
- Battery Terminal Covers
- Fire Distinguisher
- Tow Front and Rear

#### Section 3: Terms and Conditions
- Liability Waiver
- Event Rules and Regulations
- Safety Briefing Attendance Requirement
- Vehicle Inspection Agreement
- Media Release (photos/videos)
- Cancellation and Refund Policy
- Code of Conduct
- Assumption of Risk acknowledgment

**THE SYSTEM SHALL** require users to check acknowledgment boxes for each section before allowing final submission.

### FR4: Data Submission and Storage
**WHEN** a user confirms all safety requirements and terms, **THE SYSTEM SHALL**:
- Submit registration data to the backend via POST request
- Store driver information in MongoDB `drivers` collection
- Store vehicle information in MongoDB `vehicles` collection
- Create registration record + status = 'pending' in `registrations` collection with:
  - Driver ID reference
  - Vehicle ID reference
  - Event ID reference
  - Registration timestamp
  - Safety acknowledgment status
  - Terms acceptance status
  - Unique registration number (auto-generated)

### FR5: Confirmation and Receipt
**WHEN** registration is successfully saved, **THE SYSTEM SHALL**:
- Display confirmation page with registration number
- Show summary of submitted information
- Display safety checklist for printing
- the status of the registration should be 'pending'. 
- Later when the admin will change the status of all the registation.
- will show the payment page. 
**Depening on the Status will change how to handle**
### if Status=Verfied
- Send confirmation email with:
  - Registration details
  - Event information
  - Safety requirements checklist
  - QR code for event check-in

### FR6: Progress Persistence (Two-Layer Auto-Save System)
**WHILE** a user is filling the form, **THE SYSTEM SHALL**:

#### Layer 1: Debounced Auto-Save
- Save form progress to browser localStorage 2 seconds after user stops typing
- Provides responsive save behavior for active users
- Prevents excessive save operations during rapid typing
- Resets timer on each form field change

#### Layer 2: Visibility Change Save
- Save form progress when user switches tabs, minimizes window, or app goes to background
- Listens to `visibilitychange` event to detect tab/window state changes
- More reliable than `beforeunload` especially on mobile devices
- Captures: tab switches, minimize, app switching, mobile backgrounding

#### Additional Features:
- **Silent Restore**: Automatically restore saved data on page load without user confirmation
- **Data Expiry**: Automatically clear saved data older than 7 days
- **File Exclusion**: File uploads are excluded from localStorage (cannot be serialized)
  - Users must re-upload files after resuming registration
- **Timestamp Tracking**: Each save includes ISO timestamp for expiry calculation
- **Visual Feedback**: Display "Auto-saved at [time]" message after each save
- **Error Handling**: Gracefully handle localStorage full or disabled scenarios
- **Anti-Data-Loss**: Silent restore prevents confirmation dialogs that could accidentally delete data
- **Performance Optimized**: Two-layer approach reduces unnecessary saves while maintaining data safety
- Clear saved data after successful submission

### FR7: Mobile Responsiveness
**THE SYSTEM SHALL** provide a fully responsive interface optimized for:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

### FR8: Registration Edit Flow
**WHEN** a user clicks "Edit Registration" from the registration detail page, **THE SYSTEM SHALL** route to `/register?edit={registrationId}&token={magicToken}`.

**WHEN** the registration page loads in edit mode, **THE SYSTEM SHALL**:
- Fetch existing registration data using `GET /api/registrations/:id?token=...`
- Pre-fill personal, vehicle, and registration fields from existing data
- Keep event selection read-only (event cannot be changed after initial registration)
- Allow updating editable fields and submit using `PUT /api/registrations/:id?token=...`
- Show "Update Registration" as submit action text

**IF** edit token is invalid or expired, **THEN THE SYSTEM SHALL** show an error and redirect user to registration lookup.

### FR9: Vehicle Field Consistency
**WHEN** vehicle data is captured and persisted, **THE SYSTEM SHALL** use `make` as the canonical field name across frontend state, API payloads, and backend model mapping.

## Possible Edge Cases

1. **Duplicate Registration**: Ignore for now.

2. **Expired License**: User enters driver license expiry date in the past
   - System blocks submission and displays clear error message
   - Provide guidance on license renewal

3. **Underage Participant**: User age calculation shows less than 18 years
   - Show the age requirement pop-up, if user click understand, user can continue.
   - Do not block the registration, cause it can also be typo error as well.
   - Will later used the age verification by some third-party software or something by scanning the driving license. 
   - 

4. **Invalid Vehicle Year**: Will Ingnore. 

5. **Network Failure**: Connection lost during form submission
   - Implement retry mechanism
   - Preserve form data in localStorage via two-layer auto-save system
   - Data already captured by debounced and visibilitychange saves
   - Show clear error message with retry option
   - User can safely refresh page without losing data

6. **Email Already Registered**: Will ingore this

7. **Form Session Timeout**: User leaves form inactive for extended period
   - Retrieve saved progress from localStorage automatically on return
   - **Two-layer save system ensures data captured**:
     - Debounced save: Captured 2 seconds after last input
     - Visibility change save: Captured when user switches tabs or minimizes window
   - Silent restore without confirmation dialog (no risk of accidental data loss)
   - Data expires after 7 days and auto-clears
   - **Note**: File uploads cannot be persisted and must be re-uploaded

8. **Browser Compatibility**: User accesses from unsupported browser
   - Detect browser and show compatibility warning
   - Provide supported browser recommendations

9. **File Upload Failures**: If adding document upload for license/insurance
   - Validate file type (PDF, JPG, PNG only)
   - Validate file size (max 5MB)
   - Show upload progress
   - Handle upload errors gracefully

10. **Event Capacity Full**: Selected event has reached maximum participants
    - Display "Event Full" message
    - Offer waitlist option.
    - Suggest alternative events

## Acceptance Criteria

### AC1: Form Display and Navigation
- [ ] Registration form displays all required fields across 3 steps
- [ ] Step navigation shows current progress (1 of 3, 2 of 3, etc.)
- [ ] "Next" button advances to next step only after validation
- [ ] "Back" button returns to previous step without data loss
- [ ] Form is fully responsive on mobile, tablet, and desktop

### AC2: Input Validation
- [ ] All required fields show error when empty
- [ ] Email validation accepts valid formats, rejects invalid
- [ ] Phone number validation accepts international formats
- [ ] Age validation correctly calculates from date of birth
- [ ] Driver license expiry validation blocks expired licenses
- [ ] Vehicle year validation accepts 1990-2026 only
- [ ] Error messages are clear and specific

### AC3: Safety Requirements Display
- [ ] Safety wear section displays all 6+ required items
- [ ] Car components section displays all 10 mandatory components
- [ ] Terms and conditions section displays all 8 items
- [ ] Each section has acknowledgment checkbox
- [ ] Each checkbox can't be tick until the user scroll till the end.
- [ ] Submit button disabled until all boxes checked
- [ ] Content is printable/downloadable

### AC4: Data Submission
- [ ] Form submits data to POST /api/registrations endpoint
- [ ] Driver data saved to `drivers` collection
- [ ] Vehicle data saved to `vehicles` collection
- [ ] Registration record created with all references
- [ ] Unique registration number generated (format: DR-YYYY-####)
- [ ] Registration timestamp recorded in UTC

### AC5: Confirmation Flow
- [ ] Success page displays registration number prominently
- [ ] Summary shows all submitted information
- [ ] Status wil be 'Pending'.
- [ ] If status changed to 'verfied', Confirmation email sent within 1 minute
- [ ] Email contains registration details and QR code
- [ ] Print-friendly safety checklist available
- [ ] "Register Another Driver" option provided

### AC9: Edit Mode Behavior
- [ ] Edit button routes to `/register?edit={id}&token={token}` without 404
- [ ] Register page pre-fills existing registration data in edit mode
- [ ] Event information is displayed as read-only in edit mode
- [ ] Edit submission calls `PUT /api/registrations/:id?token={token}`
- [ ] Successful update redirects back to registration details page

### AC10: Vehicle Schema Mapping
- [ ] Frontend uses `make` field (not `brand`) in vehicle form state
- [ ] Create and update payloads send `vehicle.make`
- [ ] Backend persists and returns `vehicle.make` consistently

### AC6: Error Handling
- [ ] Network errors show user-friendly message
- [ ] Server errors display retry option
- [ ] Form data preserved during errors
- [ ] 404/500 errors handled gracefully

### AC7: Performance
- [ ] Form loads in under 2 seconds
- [ ] Step transitions are instant (<100ms)
- [ ] Form submission completes in under 3 seconds
- [ ] Auto-save doesn't cause UI lag
- [ ] Debounced save triggers 2 seconds after user input stops
- [ ] Visibility change save completes in under 100ms
- [ ] localStorage operations complete in under 2ms
- [ ] localStorage operations handle quota exceeded errors gracefully
- [ ] Total auto-save overhead under 5ms per minute during active typing

### AC8: Accessibility
- [ ] All form fields have proper labels
- [ ] Tab navigation works correctly
- [ ] Error announcements for screen readers
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Focus indicators visible on all interactive elements

## Open Questions

1. **Payment Integration**: for the payment page, will provide the QR code of the social media page. and asked to contact directly.

2. **Document Upload**: Yes drivers should upload photos of driver license, vehicle Regstraction, Vehical (min 1 - max 3) [Required], Profile [Optional]

3. **Event Capacity**: The capicity of the Event will be Provide when the admin create the event.

4. **Registration Editing**: Yes, Driver can edit registration after submission.(up to 24 hours before event)
    - Edit time permision, e.g up to 24 hours before event, should be dynamic based on the database' data
    - later will add the admin dashboard, and admin can edit that data to the database
**Do not add the admin dashboard right now**

5. **Admin Approval**: Yes, registrations require admin approval before confirmation?

6. **Multi-Vehicle Registration**: Yes, but ignore this, let the user to re-register with  the same personal information but different vehical information. 

7. **Team Registration**: Not for now.

8. **Insurance Requirements**: No, drivers do not need to provide insurance information.

9. **Medical Information**: Yes. system collect medical conditions and blood type.
   - Impact: Privacy compliance and data security considerations
   - Decision needed:will collect the Blood type, and any other medical condition(Allergy and any other)

10. **SMS Notifications**: Yes, system send SMS confirmations/reminders.
    - Impact: Need SMS service integration (Twilio)
    - Decision needed: email + SMS

## Testing Guidelines 

Create test file(s) in the './tests' folder for the new features, and create meaningful tests for the following cases:

### Unit Tests (Client)
- **Form Validation Functions**
  - Test email validation with valid/invalid emails
  - Test phone number validation with various formats
  - Test age calculation from date of birth
  - Test debounced save triggers after 2 seconds of inactivity
  - Test periodic save executes every 30 seconds
  - Test unload save captures data on page refresh/close
  - Test silent restore loads data without confirmation
  - Test data expiry clears saves older than 7 days
  - Test file uploads excluded from localStorage saves
  - Test manual "Save Draft" button works correctly
  - Test "Clear Progress" button resets form with confirmation
  - Test form data persistence to localStorage
  - Test form data retrieval from localStorage
  - Test form reset after successful submission
  - Test localStorage quota exceeded error handling
- **Form State Management**
  - Test debounced save triggers 2 seconds after typing stops
  - Test visibility change save triggers on tab switch/minimize
  - Test silent restore on page reload without confirmation
  - Test 7-day expiry automatically clears old data
  - Test file exclusion from localStorage (must re-upload)
  - Test step progression and navigation
  - Test form data persistence to localStorage
  - Test form data retrieval from localStorage
  - Test form reset after successful submission
  - Test localStorage quota exceeded error handling
  - Test corrupted data handling (parse errors)

### Integration Tests (Client)
- **Multi-Step Form Flow**
  - Test complete form submission from step 1 to confirmation
  - Test back navigation preserves data
  - Test validation prevents invalid progression
  - Test acknowledgment checkboxes requirement
  
- **API Integration**
  - Test successful registration submission
  - Test error handling for failed submissions
  - Test duplicate registration detection

### Unit Tests (Server)
- **Registration Controller**
  - Test POST /api/registrations creates records
  - Test duplicate registration detection
  - Test registration number generation (DR-YYYY-####)
  - Test validation error responses
  
- **Driver Model**
  - Test driver schema validation
  - Test age calculation method
  - Test license expiry validation
  
- **Vehicle Model**
  - Test vehicle schema validation
  - Test year range validation

### Integration Tests (Server)
- **Registration Flow**
  - Test driver creation in database
  - Test vehicle creation in database
  - Test registration record linking
  - Test email notification sending
  - Test QR code generation

### E2E Tests
- **Happy Path**
  - User completes entire registration flow
  - Receives confirmation email
  - Data correctly stored in database
  
- **Error Scenarios**
  - Expired driver license prevents submission
  - Underage user cannot register
  - Network error shows retry option
  - Duplicate registration shows warning

### Performance Tests
- Form loads under 2 seconds
- Step transitions under 100ms
- Submission completes under 3 seconds
- Auto-save doesn't impact performance

### Accessibility Tests
- Keyboard navigation works through entire form with two-layer auto-save system
  - `components/registration/steps/PersonalInfoStep.js` - Step 1
  - `components/registration/steps/VehicleInfoStep.js` - Step 2
  - `components/registration/steps/EventSelectionStep.js` - Step 3
  - `components/registration/steps/SafetyRequirementsStep.js` - Safety display
  - `components/registration/ConfirmationPage.js` - Success page
  
- **State Management**: React useState hooks with localStorage persistence
- **Auto-Save Implementation**:
  - `localStorage` key: `"driftland_registration_draft"`
  - Saved data structure: `{ formData, currentStep, timestamp }`
  - Two concurrent save strategies: debounced (2s after typing stops), visibilitychange (tab switch/minimize)
  - Silent restore on mount with 7-day expiry check
  - No manual controls - fully automatic
- **Validation**: Custom validation functions in `utils/validation.js`
  - `app/register/page.js` - Main registration page
  - `components/registration/DriverInfoForm.js` - Step 1
  - `components/registration/VehicleInfoForm.js` - Step 2
  - `components/registration/EventSelectionForm.js` - Step 3
  - `components/registration/SafetyRequirements.js` - Safety display
  - `components/registration/ConfirmationPage.js` - Success page
  
- **State Management**: Use React state or Context API for form data
- **Validation**: Use client-side validation library (e.g., Zod, Yup)
- **Styling**: CSS Modules following existing pattern

### Backend (Express + MongoDB)
- **Models**:
  - `models/Driver.js` - Driver schema with validation
  - `models/Vehicle.js` - Vehicle schema with validation
  - `models/Registration.js` - Registration schema
  - `models/Event.js` - Event schema (if not exists)
  
- **Routes**:
  - `POST /api/registrations` - Create new registration
  - `GET /api/registrations/:id` - Get registration by ID
  - `GET /api/events` - List available events
  
- **Controllers**:
  - `controllers/registrationController.js` - Registration logic
  
- **Services**:
  - `services/emailService.js` - Email notifications
  - `services/qrcodeService.js` - QR code generation

### Database Schema

```javascript
// Driver Schema
{
  fullName: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  licenseNumber: String,
  licenseExpiry: Date,
  address: String,
  emergencyContact: {
    name: String,
    phone: String
  },
  createdAt: Date
}

// Vehicle Schema
{
  make: String,
  model: String,
  year: Number,
  registrationNumber: String,
  color: String,
  engineSpec: String,
  category: String,
  driverId: ObjectId,
  createdAt: Date
}

// Registration Schema
{
  registrationNumber: String, // DR-2026-0001
  driverId: ObjectId,
  vehicleId: ObjectId,
  eventId: ObjectId,
  competitionClass: String,
  previousExperience: Boolean,
  specialRequirements: String,
  safetyAcknowledged: Boolean,
  termsAccepted: Boolean,
  status: String, // pending, confirmed, cancelled
  registrationDate: Date,
  qrCode: String // URL or base64
}
```

## Confidence Score: 90%

**Rationale**: 
- Requirements are well-defined and testable
- Standard form implementation with clear data flow
- Existing tech stack (MERN) supports all requirements
- Similar patterns used in many registration systems

**Risks**:
- Email service configuration needs verification
- QR code generation library selection
- Form state management complexity with 3 steps
- Mobile responsiveness testing across devices

**Mitigation**:
- Use proven libraries (Nodemailer, qrcode npm package)
- Implement progressive enhancement for mobile
- Thorough testing plan included above

## Implementation Notes

### API Response Structure
The registration lookup and view endpoints return reshaped responses for cleaner frontend access:

**Response Structure**:
```javascript
{
  success: true,
  data: {
    _id: "...",
    registrationNumber: "DR-2026-0001",
    status: "pending",
    driver: { fullName: "...", email: "...", ... },      // Clean naming
    vehicle: { make: "...", model: "...", ... },         // Clean naming
    event: { name: "...", canEdit: true, ... }           // Includes computed properties
  }
}
```

**Note**: Field names are reshaped from MongoDB's `driverId`, `vehicleId`, `eventId` to cleaner `driver`, `vehicle`, `event` for better frontend developer experience.

### Route Ordering
**CRITICAL**: In Express routes, specific paths must be defined BEFORE parameterized paths:

```javascript
// ✅ CORRECT ORDER
router.get("/lookup", lookupRegistration);  // Specific route first
router.get("/:id", getRegistration);        // Parameterized route second

// ❌ INCORRECT - "/lookup" would match "/:id" treating "lookup" as an ID
router.get("/:id", getRegistration);
router.get("/lookup", lookupRegistration);
```

This prevents "Cast to ObjectId" errors when accessing specific endpoints.
