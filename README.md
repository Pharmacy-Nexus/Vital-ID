# VITAL ID Demo — Functional v2

This version fixes the demo so patient data is no longer read only from hard-coded seed objects.

## What works
- Shared patient state in `localStorage` (`vital-id-demo-state`)
- Activation writes the patient data used by Dashboard / Emergency / Doctor views
- Medical Profile can add, edit, delete and confirm:
  - Conditions
  - Medications
  - Allergies
  - Surgeries
  - Vaccinations
  - Emergency contacts
- Basic information can be edited after activation
- Emergency visibility can be set per condition / medication / allergy
- Emergency page only shows emergency-visible items
- Arabic / English toggle persists in localStorage and switches RTL/LTR
- Doctor OTP demo remains `4827`
- Document demo can confirm extracted data into the same patient record
- Reset Demo restores original seed data

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
- Framework Preset: **Next.js**
- Root Directory: repository root (the folder containing `package.json`)
- Vercel Authentication: disable it for the public Emergency QR demo

## Important demo note
This is still a localStorage demo. It is not production-ready for real patient data. Production needs real authentication, backend/database, server-side authorization, audit logging, privacy controls, and security review.
