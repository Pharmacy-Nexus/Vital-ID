# Supabase setup for VITAL ID v4

## 1. Create the project

Create a new Supabase project and keep the project dashboard open.

## 2. Create database + security rules

Open **SQL Editor** in Supabase, create a new query, paste the entire contents of:

`supabase/migrations/001_vital_id.sql`

Run it once.

It creates:

- `patients`
- `devices`
- `activity_logs`
- private Storage bucket `medical-documents`
- Row Level Security policies for owner data
- Storage policies that isolate files by authenticated owner ID

## 3. Copy keys

From Supabase project settings/API, collect:

- Project URL
- Publishable key (or legacy anon key)
- Service role key

The service role key is a secret. Never paste it into browser code and never use a variable beginning with `NEXT_PUBLIC_` for it.

## 4. Add Vercel Environment Variables

Vercel → VITAL ID project → **Settings → Environment Variables**.

Add:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
VITAL_ID_SESSION_SECRET=YOUR_LONG_RANDOM_SECRET
VITAL_ID_DEMO_OTP=4827
```

Use a long random value (at least 32 characters) for `VITAL_ID_SESSION_SECRET`.

Apply them to Production (and Preview too if you test Preview deployments).

Then redeploy the latest GitHub commit.

## 5. Create the owner account

Open:

`https://YOUR_DOMAIN/login`

Choose **Create account** and use an email/password.

Depending on the Supabase Auth settings, you may need to confirm the email first.

After sign-in, open `/dashboard`. The banner should become:

`Cloud synced`

On the first sync, if the cloud database has no patient records for this account, the current browser state is uploaded automatically.

## 6. Test the core cross-device flow

On the owner browser:

1. Dashboard → Medical.
2. Add Allergy: `Aspirin`.
3. Reaction: `Severe rash`.
4. Visibility: `Emergency`.
5. Save.
6. Dashboard → Devices.
7. Open the Emergency Bracelet QR.

On another phone (not signed in):

1. Scan that QR.
2. `Aspirin` should appear.
3. Change Aspirin to Private on the owner browser.
4. Re-open the QR (or wait up to 15 seconds on the open page).
5. Aspirin should disappear publicly but remain in the owner/clinician record.

## 7. Test different QR devices

Create or edit two devices:

- Bracelet: Allergies ON, Medications ON.
- Wallet Card: Allergies ON, Medications OFF.

Scan both links on another phone. They should display different sections while reading the same patient record.

Regenerate one QR. The old URL should stop resolving and the new URL should work after cloud sync completes.

## 8. Test files/images

While signed into the owner account:

1. Dashboard → Documents.
2. Upload an image or PDF.
3. Save.
4. Open it again on the owner device.
5. Open the same account on another browser, sign in, and open the document.
6. Scan a QR, choose Healthcare Professional, enter the demo OTP, and open the document from the clinician record.

Only files uploaded while cloud-connected are cross-device. Older IndexedDB-only demo files remain local to the browser that created them.

## If a QR still shows old local demo data

Confirm all three points:

1. Dashboard says **Cloud synced**.
2. The QR came from Dashboard → Devices and uses `/id/qr-...`, not an old hardcoded `/id/demo-001` link.
3. Vercel contains all three Supabase variables plus the service-role key and was redeployed after adding them.

## v4.5 — Enable clinician suggestions

If you are upgrading an existing VITAL ID cloud project, keep your current database and run only this additional migration:

`supabase/migrations/002_clinical_suggestions.sql`

Supabase → **SQL Editor → New query** → paste the full contents of that file → **Run**.

The migration creates `clinical_suggestions` with RLS so authenticated owners can read and review only their own patients' suggestions. Public/anonymous browsers are not granted table access. Clinician submissions are accepted only by the server route after a valid temporary clinician-session token is verified.

After the migration and deploy, test:

1. Scan a live device QR from a second phone.
2. Choose Healthcare Professional and authorize the temporary session.
3. Open **Add clinical update** and send an Allergy such as `Aspirin` + `Severe rash`.
4. On the signed-in owner account open **Dashboard → Clinician updates**.
5. Accept the suggestion.
6. Confirm the new item appears in the medical record. It is private by default until the owner changes its visibility.

## Migration 003 — Temporary record sharing

After 001 and 002, run:

`supabase/migrations/003_temporary_shares.sql`

This adds expiring/revocable share links. No new storage bucket is required; Full Record sharing uses temporary signed URLs from the existing private `medical-documents` bucket.
