# DocMinty — Agent Instructions

## How to work on this project
1. Always read the relevant file BEFORE editing it
2. Run `npm run dev` to test frontend changes
3. Run `mvn spring-boot:run` to test backend changes
4. Check browser console for errors after changes

## File Locations
- Pages: `src/app/[route]/page.jsx`
- Components: `src/components/`
- Templates: `src/templates/`
- API calls: `src/api/`
- Backend controllers: `src/main/java/com/docminty/controller/`
- Backend services: `src/main/java/com/docminty/service/`

## Current Pending Tasks

### 1. Save Document Button (HIGH PRIORITY)
Add "Save to Cloud" button on all 14 generator pages.
After PDF download, call `documentsApi.save()` with form data.
Only show save button if user is logged in (`getAccessToken()`).
Files to edit: `src/app/invoice/page.jsx`, `quotation`, `receipt`, etc.

### 2. Certificate QR Verification page
File: `src/app/verify/[id]/page.jsx`
Call: `GET http://localhost:8080/api/verify/{id}`
Show: certificate details if valid, error if not found.

### 3. Dashboard Profile page
File: `src/app/dashboard/profile/page.jsx`
Call: `PUT http://localhost:8080/api/auth/me` to update user info.

### 4. Production Deployment
- Frontend: Deploy to Vercel (`vercel deploy`)
- Backend: Build JAR with `mvn package`, deploy to Railway/VPS
- MySQL: Use Railway MySQL or PlanetScale

## Backend Endpoints Available
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/refresh
GET  /api/auth/me
POST /api/payment/create-order
POST /api/payment/verify
GET  /api/documents
POST /api/documents
DELETE /api/documents/{id}
POST /api/verify
GET  /api/verify/{id}
GET  /api/admin/stats
GET  /api/admin/users
GET  /api/admin/revenue
PUT  /api/admin/users/{id}/ban
PUT  /api/admin/users/{id}/unban
```

---

### How to use Claude Code now:

In Antigravity terminal, just type natural language like:
```
Add save document button to invoice page
```
```
Wire the verify/[id] page to the backend API
```
```
Fix the PREVIEW_DOC_TYPES duplicate in page.jsx