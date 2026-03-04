# DriftLand Driver Registration System

A complete MERN stack application for managing driver registrations for DriftLand motorsports events.

## 📋 Project Overview

This system allows drivers to register for drift and time attack events with a comprehensive multi-step registration process including:
- Personal information and medical details
- Vehicle information with Myanmar registration format support
- Event selection with capacity management
- Safety requirements and terms acknowledgment
- Magic link authentication for registration management
- QR code generation for event check-in

## 🔧 Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library with React Compiler enabled
- **CSS Modules** - Component-scoped styling

### Backend
- **Express 5.2.1** - Node.js web framework
- **MongoDB + Mongoose 8.21.0** - Database and ODM
- **Multer 2.0.2** - File upload handling
- **Nodemailer 7.0.12** - Email notifications
- **QRCode 1.5.4** - QR code generation

## 📁 Project Structure

```
DRIFTLAND/
├── client/                          # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── register/           # Registration pages
│   │   │   │   ├── page.js         # Main registration form
│   │   │   │   └── success/        # Success page
│   │   │   └── registration/
│   │   │       ├── lookup/         # Status lookup page
│   │   │       └── [id]/           # View registration details
│   │   ├── components/
│   │   │   └── registration/
│   │   │       ├── FormProgress.js # Progress indicator
│   │   │       ├── fields/
│   │   │       │   └── FileUpload.js # Reusable file upload
│   │   │       └── steps/
│   │   │           ├── PersonalInfoStep.js
│   │   │           ├── VehicleInfoStep.js
│   │   │           ├── EventSelectionStep.js
│   │   │           └── SafetyRequirementsStep.js
│   │   └── utils/
│   │       └── validation.js       # Validation utilities
│   └── .env.local                  # Client environment variables
│
├── server/                          # Express backend
│   ├── models/                     # Mongoose models
│   │   ├── Driver.js
│   │   ├── Vehicle.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   └── SafetyRequirements.js
│   ├── controllers/                # Route controllers
│   │   ├── registrationController.js
│   │   ├── eventController.js
│   │   └── safetyRequirementsController.js
│   ├── routes/                     # API routes
│   │   ├── registrationRoutes.js
│   │   ├── eventRoutes.js
│   │   └── safetyRequirementsRoutes.js
│   ├── services/                   # Business logic
│   │   ├── emailService.js
│   │   └── qrcodeService.js
│   ├── middleware/
│   │   └── upload.js              # Multer configuration
│   ├── config/
│   │   └── database.js            # MongoDB connection
│   ├── seeds/
│   │   └── safetyRequirements.js  # Initial data seeding
│   ├── uploads/                    # File storage directory
│   ├── app.js                      # Express app setup
│   └── .env                        # Server environment variables
│
└── _specs/                         # Documentation
    ├── driver-registration.md      # Feature specification
    └── _designs/
        ├── driver-registration.md  # Technical design
        └── frontend-implementation-guide.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **Git**

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `server` directory:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/driftland

   # Server
   PORT=5000
   NODE_ENV=development

   # Authentication
   JWT_SECRET=your-secret-key-here

   # Email (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM="DriftLand Events <noreply@driftland.com>"

   # SMS (Twilio - Optional)
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890

   # Frontend URL
   CLIENT_URL=http://localhost:3000
   SERVER_URL=http://localhost:5000
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

   The server will start on http://localhost:5000

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The client will start on http://localhost:3000

## 🔑 Key Features

### Multi-Step Registration Form

1. **Personal Information**
   - Full name, email, phone number
   - Date of birth validation (18+ required)
   - Driver license number and expiry
   - Emergency contact details
   - Medical information (blood type, allergies, conditions)
   - Document uploads (license photo, profile photo)

2. **Vehicle Information**
   - Make, model, year (1990-present)
   - Myanmar registration format validation (AA-1234)
   - Color and engine specifications
   - Vehicle category selection
   - Document uploads (registration, 1-3 photos)

3. **Event Selection**
   - Upcoming events with capacity tracking
   - Drive type selection (Drift/Time Attack)
   - Experience level indicator
   - Special requirements notes

4. **Safety Requirements**
   - Scrollable safety wear requirements
   - Car component specifications
   - Terms and conditions
   - Acknowledgment checkboxes enabled after scroll

### Magic Link Authentication

- No traditional login required
- Access via email link with secure token
- 7-day token expiration
- Manual lookup with registration number + email

### Admin Features (Backend Ready)

- Registration status management (pending/verified/rejected/cancelled)
- QR code generation upon verification
- Email notifications for status changes
- Event capacity tracking
- Dynamic safety requirements management

## 📧 Email Notifications

### Pending Registration
- Sent immediately after registration
- Contains magic link for access
- Registration number for reference
- What to expect next

### Verified Registration
- Sent after admin approval
- Includes QR code for event check-in
- Payment instructions
- Safety checklist reminder
- Event details

## 🎯 API Endpoints

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations/:id` - Get registration (with token)
- `GET /api/registrations/lookup` - Lookup by number + email
- `PUT /api/registrations/:id` - Update registration
- `PATCH /api/registrations/:id/status` - Update status (admin)

### Events
- `GET /api/events` - List events (filter by status)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)

### Safety Requirements
- `GET /api/safety-requirements` - Get all requirements
- `GET /api/safety-requirements/:category` - Get by category

## ✅ Validation Rules

### Email
- Standard email format

### Phone
- E.164 format (e.g., +959XXXXXXXXX)

### Age
- Must be 18 or older
- Warning shown but doesn't block registration

### Driver License
- License expiry must be in the future

### Vehicle Registration
- Myanmar format: 2 alphanumeric characters + dash + 4 digits
- Example: AA-1234, 5B-9876

### Vehicle Year
- Between 1990 and current year

### File Uploads
- Max size: 5MB per file
- Accepted formats: 
  - Images: JPG, PNG
  - Documents: PDF
- Vehicle photos: 1-3 required

## 🧪 Testing

### Backend Testing

1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Start backend server:**
   ```bash
   cd server
   npm run dev
   ```

3. **Test health endpoint:**
   ```bash
   curl http://localhost:5000/health
   ```

4. **Create a test event:**
   ```bash
   curl -X POST http://localhost:5000/api/events \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Drift Event",
       "description": "Test event for development",
       "eventDate": "2026-03-15T10:00:00Z",
       "location": "Test Track",
       "capacity": 50,
       "driveTypes": ["Drift", "Time Attack"],
       "registrationDeadline": "2026-03-10T23:59:59Z"
     }'
   ```

### Frontend Testing

1. **Start both servers** (backend on :5000, frontend on :3000)

2. **Test registration flow:**
   - Navigate to http://localhost:3000/register
   - Fill out all 4 steps
   - Submit and verify success page
   - Check email for magic link

3. **Test lookup:**
   - Go to http://localhost:3000/registration/lookup
   - Enter registration number and email
   - Verify redirection to view page

### Edge Cases to Test

- ✅ Invalid email format
- ✅ Under 18 age (should show warning)
- ✅ Expired driver license
- ✅ Invalid Myanmar vehicle registration format
- ✅ File size exceeding 5MB
- ✅ More than 3 vehicle photos
- ✅ Full event (should disable selection)
- ✅ Past registration deadline

## 🔒 Security Considerations

- Magic tokens are cryptographically secure (32 bytes)
- File uploads are validated for type and size
- CORS configured for client URL only
- Environment variables for sensitive data
- Database connection with authentication
- Input validation on both client and server
- SQL injection protection via Mongoose
- XSS protection via React

## 🚢 Deployment

### Environment Variables for Production

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/driftland
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-production-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="DriftLand Events <noreply@driftland.com>"
CLIENT_URL=https://yourdomain.com
SERVER_URL=https://api.yourdomain.com
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Pre-Deployment Checklist

- [ ] MongoDB database created and accessible
- [ ] Email service configured and tested
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] SSL certificates installed
- [ ] File upload directory writable
- [ ] Health check endpoint responds
- [ ] Error logging configured
- [ ] Backup strategy in place

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Nodemailer Documentation](https://nodemailer.com/about/)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running: `mongod`
- Check connection string in `.env`
- Ensure database user has correct permissions

### CORS Error
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS middleware configuration in `app.js`

### File Upload Error
- Ensure `uploads` directory exists and is writable
- Check file size (max 5MB)
- Verify file type (images or PDF only)

### Email Not Sending
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" if needed
- Check email credentials in `.env`
- Verify SMTP settings

## 👥 Contributors

This project was developed using a specification-driven approach with comprehensive documentation and testing.

## 📄 License

[Add your license here]

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the technical design document in `_designs/`
3. Open an issue on the project repository

---

**Version:** 1.0.0  
**Last Updated:** February 2026
