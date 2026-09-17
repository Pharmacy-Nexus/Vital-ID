# VITAL ID — Editorial Homepage v4.2

# VITAL ID Functional Demo v4 — Cloud Sync

This version moves the important shared state from a one-browser demo toward a real multi-device prototype using Supabase.

## What v4 adds

- **Cloud patient sync**: edits from Dashboard → Medical can be stored in Supabase and then read from a QR scan on another phone/browser.
- **Per-device QR identity**: every bracelet/card/tag keeps its own `qrSlug`, active/deactivated state and emergency display settings.
- **Live emergency view**: `/id/<qrSlug>` tries the server/cloud first, uses `no-store`, refreshes every 15 seconds while open, and refreshes when the tab becomes visible again.
- **Server-side emergency filtering**: private items are stripped before the public response is sent. Hidden sections are not merely hidden with CSS.
- **Cloud owner authentication**: `/login` supports Supabase email/password sign-in and account creation.
- **Dashboard cloud status**: the owner sees whether cloud sync is connected. The first signed-in session uploads the existing local demo state if the cloud account is empty.
- **Cloud documents/images**: when the owner is signed in, new uploads go to the private Supabase Storage bucket `medical-documents`; local IndexedDB remains the fallback when signed out.
- **Authorized clinician document view**: cloud files can be opened through a short-lived clinician session after the demo OTP.
- **Cloud activity**: public scans and shared locations are written to `activity_logs` and pulled into the owner dashboard.
- **Unique patient activation**: a newly activated person gets a unique patient slug instead of overwriting `demo-001`.
- **Dynamic family profiles**: Family now lists patient profiles and lets the owner switch which one is being managed.

## Setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

The minimum sequence is:

1. Create a Supabase project.
2. Run `supabase/migrations/001_vital_id.sql` in Supabase SQL Editor.
3. Add the variables from `.env.example` to Vercel.
4. Redeploy.
5. Open `/login`, create/sign into the owner account.
6. Wait for **Cloud synced** on the Dashboard.
7. Edit an Emergency-visible medical item and scan the device QR from another phone.

## Important routes

- `/` — demo home
- `/login` — owner cloud sign-in
- `/activate` — create a new patient profile and first device
- `/dashboard` — owner dashboard + cloud sync status
- `/dashboard/medical` — add/edit patient medical data
- `/dashboard/documents` — upload/view files and images
- `/dashboard/devices` — independent QR devices and display controls
- `/dashboard/family` — switch/manage multiple patient profiles
- `/id/<qrSlug>` — public emergency view for one physical ID

Demo clinician OTP: `4827` (configurable with `VITAL_ID_DEMO_OTP`).

## Storage model

The current prototype intentionally keeps the existing `PatientProfile` and `LinkedDevice` objects as JSONB records in Supabase. This makes the migration from the existing demo small and predictable. A later production version can normalize clinical items into dedicated tables without changing the public product flow.

The browser still keeps a local cache for offline/demo behavior. Supabase is the shared source used by public QR scans once cloud sync is configured.

## Security boundaries in this prototype

- `SUPABASE_SERVICE_ROLE_KEY` is used only by server routes and must never be exposed in a `NEXT_PUBLIC_*` variable.
- Database tables have RLS enabled and ordinary anonymous users are not granted table access.
- Public QR requests go through server routes that return only Emergency-visible fields allowed by that particular device.
- The medical document bucket is private. The owner reads files through authenticated Storage access; an authorized clinician gets a short-lived signed URL.
- The fixed clinician OTP is **demo-only**. Do not use it with real patient data.
- This remains a prototype. Do not store real patient health information until privacy, consent, security testing, legal requirements, retention, audit controls and production authentication have been reviewed.

## Homepage refresh (v4.1)
The `/` route is now a customer-facing VITAL ID landing page using the provided black/white NFC card artwork. Existing dashboard, emergency, clinician, activation, login and Supabase/cloud flows are unchanged.


## v4.3 — Interactive product objects
- Added Black VITAL ID Wristband and Kids White/Green Wristband assets.
- Rebuilt the Objects section as an interactive product selector.
- Clicking any card/wristband opens an animated editorial detail panel with use cases and key functions.
- Added mobile horizontal swipe selector and responsive product detail layout.
- No backend, Supabase, QR, dashboard, OTP, or cloud logic changed.

## v4.4 Dashboard & profile update

- Fixed the Activation form focus bug: typing no longer loses focus after each character.
- Rebuilt `/dashboard` as a responsive owner home with patient summary, medical snapshot, live QR and quick actions.
- Added profile photo upload for adults/children using the existing private Supabase storage bucket (with local IndexedDB fallback).
- Added an owner-controlled option to show/hide the profile photo in the public Emergency ID.
- Public Emergency ID and clinician view can receive short-lived signed photo URLs; the private storage path is not exposed.
- Added a desktop sidebar while keeping the mobile bottom navigation.
- Widened dashboard subpages on desktop for better use of space.

## v4.5 Clinician suggestions

- Authorized clinician sessions can now create a **Clinical Update** without directly editing the patient record.
- Supported suggestion types: condition, medication start/change/stop, allergy, lab result, radiology result, surgery/procedure, vaccination, clinical note, and document-only.
- A clinician may attach a PDF or image (maximum 12 MB). Attachments are uploaded server-side to the existing private `medical-documents` bucket.
- Suggestions appear in `/dashboard/review` for the owner/patient.
- The patient can **Accept & add to record** or **Reject** each suggestion.
- Accepted structured data is merged into the current patient record with `Clinician suggested · patient approved` provenance where the data model supports source labels.
- Rejected suggestion attachments are removed from private storage when possible.
- Suggest / accept / reject actions are added to the activity history.
- Clinicians still cannot change account, device, QR, privacy, identity or emergency-contact settings directly.

### Required database update

After v4.5 is deployed, run `supabase/migrations/002_clinical_suggestions.sql` once in the Supabase SQL Editor. Do **not** re-run or replace migration 001.

## Build note

This package was prepared from the user-uploaded v4.4 archive. Static TypeScript syntax parsing passed for all 51 TS/TSX files and all local @/ imports resolved. A full npm build was not run because dependency installation timed out in this environment; Vercel should perform the final production build.

## v4.6 visual refresh

This build keeps the v4.5 medical/doctor functionality and changes the visual system to match the supplied Apple-style reference:
- near-white #F5F5F7 canvas
- #1D1D1F typography
- #0071E3 as the primary interactive color
- pill primary/secondary actions
- 8px cards/inputs and hairline borders
- no card/button shadows
- desktop dashboard moved from sidebar navigation to a restrained sticky top navigation
- emergency view simplified for faster scanning
- existing VITAL ID logo/product assets retained
- the old AI disclaimer was removed from Medical Record because the current product direction is no-AI backend

## v4.7 — Medical Passport features (no AI backend)

This build expands VITAL ID from an Emergency ID into a simple medical passport while keeping the main navigation to four areas: Home, Record, Family, Profile.

### Added
- **Medical Vault** inside `Dashboard → Record → Files` with manual categories for labs, radiology, prescriptions, discharge papers, surgery, vaccination, visit notes, and other files.
- **Medical Timeline** generated deterministically from the structured record and uploaded-file dates. No AI extraction or inference is used.
- **Temporary Sharing** at `/dashboard/share` with three simple presets: Emergency only, Doctor visit, Full record. Links expire automatically and can be revoked immediately.
- **Public temporary record** at `/share/[token]`. Full-record shares can open original cloud files through short-lived signed URLs; file storage paths are never returned to the browser.
- **Simplified navigation**: Home / Record / Family / Profile.
- Existing **Doctor Contributions**, **Family profiles**, and **Emergency Identity** remain integrated with the same patient data source.

### Required Supabase migration
Run this once after migrations 001 and 002:

`supabase/migrations/003_temporary_shares.sql`

The migration creates the private `share_links` table with owner-only RLS. Public share reads go through the server using the service role and are rejected after expiry or revocation.

## v4.7.1 build fix
Wrapped /dashboard/record useSearchParams() inside React Suspense to satisfy Next.js 15 prerender requirements on Vercel. No database changes required.
