# DocMinty — Project Context for Claude Code

## Project
DocMinty is a free GST document generator SaaS for Indian businesses.
- Frontend: Next.js (App Router) at `C:\Users\admin\Documents\DocMintyC\docminty\`
- Backend: Spring Boot + MySQL at `C:\Users\admin\Documents\DocMintyC\backend\`

## Critical Rules
1. **File writes**: ALWAYS use `$lines.Add()` + `WriteAllLines()` with ASCII encoding. NEVER use heredoc — it produces empty files on this machine.
2. **Rupee symbol**: NEVER use ₹ in any file. Use `"Rs."` string instead — ₹ corrupts Turbopack builds.
3. **Java files**: Write without BOM (use UTF8 without BOM encoding).
4. **"use client"**: Must be first line in all Next.js client components.
5. **Metadata**: Cannot be in files with "use client" — put in separate `layout.jsx`.

## Tech Stack
- Frontend: Next.js 16.2, Tailwind (minimal), Lucide icons, react-hot-toast
- Backend: Spring Boot 3.2.3, Java 21, MySQL 8, JWT (jjwt 0.12.3), Razorpay, Lombok
- Brand color: T = "#0D9488" (teal)
- Fonts: Space Grotesk (headings), Inter (body)
- Background: #F0F4F3

## CSS Classes (globals.css)
- `doc-page-wrap` — two-panel layout wrapper
- `form-panel` — left form panel
- `preview-panel` — right preview panel
- `form-label` — section heading (uppercase, small)
- `field-label` — input label
- `doc-input` — standard input field
- `doc-textarea` — textarea field
- `toggle-btn` + `toggle-btn active` — toggle button
- `download-pdf-btn` — teal download button

## API
- Frontend calls backend at `http://localhost:8080/api`
- JWT stored in localStorage as `docminty_access_token`
- Refresh token as `docminty_refresh_token`
- API files: `src/api/client.js`, `auth.js`, `documents.js`, `payment.js`, `admin.js`

## Pending Work (Priority Order)
1. Save Document button on all 14 generator pages
2. Wire Certificate QR /verify/[id] page to backend
3. Dashboard Profile & Settings pages (wire to API)
4. Production deployment (Vercel + Railway/VPS)
5. Fix Landing page Document Preview section (PREVIEW_DOC_TYPES bug)
6. Real Razorpay live keys setup