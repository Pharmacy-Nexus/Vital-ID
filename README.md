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
