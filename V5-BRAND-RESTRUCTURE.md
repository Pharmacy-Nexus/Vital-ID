# VITAL ID v5.0 — Brand & Homepage Restructure

This update restructures the public marketing site while leaving the medical app/backend flows intact.

## What changed
- New warm ivory / soft black / VITAL lime visual system.
- Rebuilt homepage information architecture around a clearer product story.
- New hero focused on VITAL ID as a medical identity, not only an emergency card.
- Simplified 3-step “How it works” section.
- Cinematic V6.1 experience integrated as a full-width dark transition section.
- Campaign card renders are now used throughout the site.
- Medical Passport section added to explain files, timeline and temporary sharing.
- New audience section for children, older adults, chronic conditions and everyday use.
- Product section rebuilt around black card, white card, adult wristband and kids wristband.
- Privacy section simplified into emergency/public, protected/private and temporary access.
- New final CTA and simplified footer.
- Responsive/mobile layouts rebuilt for the new homepage.

## Backend / app behavior
No Supabase schema changes were made in this update.
No emergency, doctor, dashboard, authentication or sharing logic was changed.

## Validation
- `app/page.tsx` passed TypeScript syntax transpilation.
- CSS brace balance checked successfully.
- All homepage image assets referenced by the new page are present.
- Full `npm install` / Next.js production build could not be completed in the execution environment because package installation timed out.
