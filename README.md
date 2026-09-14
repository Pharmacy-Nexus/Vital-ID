# VITAL ID Functional Demo v3

This build extends the functional demo with configurable, unique QR IDs and real local document/image attachments.

## What is new in v3

- Medical items added in **Dashboard → Medical** are read by the Emergency QR page from the same patient state.
- Every linked physical ID now has its own unique `qrSlug` and therefore its own QR URL.
- Bracelet, wallet card, bag tag and newly created IDs can have different public emergency sections.
- Device owners can rename an ID, enable/disable public sections, disable/reactivate it, or regenerate its QR URL. Regenerating a QR invalidates the old custom device URL in the current demo state.
- Additional Medical IDs can be created from the Devices page.
- Documents and images can now be uploaded as real browser files, not just fake filenames.
- Uploaded images can be previewed; PDFs can be viewed in-browser; files can be opened/downloaded/deleted.
- Document metadata can be marked Emergency-visible or Private. The public Emergency page only shows allowed metadata; the file remains part of the protected record.
- Doctor Record uses the real uploaded local attachment when available.
- Camera/photo input is supported on compatible phones.
- Reset Demo also resets the new device configuration and locally stored attachments.

## Demo routes

- `/` — demo home
- `/dashboard` — patient dashboard
- `/dashboard/medical` — add/edit medical data
- `/dashboard/documents` — upload/view images and PDFs
- `/dashboard/devices` — unique QR IDs and per-device public display controls
- `/id/<qrSlug>` — emergency view for a specific physical ID
- `/activate` — activation flow

Demo OTP: `4827`

## Important architecture note

This remains a **local demo**. Patient state is stored in `localStorage`, and file blobs are stored in browser `IndexedDB`.

That means data edited on one browser/device is not automatically available on another browser/device. A real emergency QR that must always show the latest owner data on any visitor phone requires a shared backend/database (for example Supabase) and secure cloud file storage. The UI/data model in this build is structured so that storage can be replaced in the next phase.

Do not use this demo with real patient data.
