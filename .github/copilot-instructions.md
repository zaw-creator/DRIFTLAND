# Driftland - Enterprise Website Development Guidelines
## Project Overview
DriftLand is comprehensive entreprise website, mainly foucused on ticketing and event management. Features and functions wil be added iteratively, with a strong emphasis on clear specifications, maintainable code, and robust testing. The project is structured as a monorepo with a Next.js 16 frontend and an Express.js backend, following a spec-driven development approach to ensure clarity, consistency, and maintainability across the codebase.
## Architecture

**Monorepo Structure:** Client-server separation with independent deployment paths
- `client/` - Next.js 16 frontend (React 19, React Compiler enabled)
- `server/` - Express.js backend (Node.js + MongoDB/Mongoose)

**Development Approach:** Spec-driven development - always reference or create specifications before implementing features

## Tech Stack

### Client (Frontend)
- **Framework:** Next.js 16.1.1 with App Router ([client/src/app](client/src/app))
- **React:** v19.2.3 with React Compiler enabled ([next.config.mjs](client/next.config.mjs))
- **Styling:** CSS Modules (see [page.module.css](client/src/app/page.module.css))
- **Linting:** ESLint v9 with Next.js config ([eslint.config.mjs](client/eslint.config.mjs))

### Server (Backend)
- **Runtime:** Node.js with Express v5.2.1
- **Database:** MongoDB with Mongoose v8.21.0
- **Authentication:** JWT (jsonwebtoken) + bcrypt for password hashing
- **File Upload:** Multer v2.0.2
- **Email:** Nodemailer v7.0.12
- **Additional Features:** QR code generation (qrcode v1.5.4)

## Build and Test Commands

### Client
```bash
cd client
npm install          # Install dependencies
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run ESLint
```

### Server
```bash
cd server
npm install          # Install dependencies
npm run dev          # Development with nodemon (add dev script)
npm start            # Production server
```

## Code Style

- **JavaScript:** Use ES6+ modules (`import/export`)
- **File Naming:** kebab-case for files, PascalCase for React components
- **React Components:** Function components with hooks (React 19 patterns)
- **Config Files:** `.mjs` extension for ESM configs
- **Ignored Paths:** `.next/`, `out/`, `build/`, `node_modules/` (see [eslint.config.mjs](client/eslint.config.mjs))

## Project Conventions

### Frontend
- **App Router:** Use Next.js 14+ App Router conventions (no Pages Router)
- **Server Components:** Default to Server Components, use `'use client'` only when needed
- **Image Optimization:** Always use `next/image` for images
- **Route Structure:** File-based routing in `client/src/app/`

### Backend
- **API Structure:** RESTful endpoints with Express routers
- **Models:** Mongoose schemas with validation
- **Authentication:** JWT-based auth with bcrypt password hashing
- **Environment:** Use `.env` files with dotenv (never commit `.env`)
- **CORS:** Configured for cross-origin requests

## Security

- **Passwords:** Always hash with bcrypt before storing
- **Tokens:** JWT for stateless authentication
- **Environment Variables:** Store secrets in `.env` files
- **CORS:** Configure allowed origins explicitly
- **File Uploads:** Validate file types and sizes with Multer

## Integration Points

- **Client-Server Communication:** REST APIs via fetch/axios
- **Database:** MongoDB connection via Mongoose ODM
- **Email Service:** Nodemailer for transactional emails
- **File Storage:** Multer handles multipart/form-data uploads
- **QR Codes:** Server-side generation for tickets/authentication


## Development Workflow
 Based on the 'instrctions/spec-driven.instructions.md' file, the development workflow emphasizes a spec-driven approach with the following key principles:


## Additional Coding Preferences
- **Minimal Dependencies:** Use minimal project dependencies and avoid unnecessary files where possible
