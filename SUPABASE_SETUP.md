# Supabase setup — VITAL ID Hardened

> **Important:** This is an application handling sensitive medical information. The project has been hardened in source code, but it has **not** passed deployed security testing or a load test. Do not deploy with real patient records yet.

## Required migrations

A fresh environment: apply `001_vital_id.sql`, `002_clinical_suggestions.sql`, `003_temporary_shares.sql`, then `004_security_and_scale.sql` **in that order** in Supabase SQL Editor.

Existing installation that already has 001–003: back up everything, audit data consistency, then apply **only** `004_security_and_scale.sql`. It deliberately fails when existing records violate same-owner constraints or share-token/expiry restrictions. Investigate, don't delete unexplained records blindly.

`004` also adds `clinician_sessions`, atomic rate limit, atomic scan/event logger, and optimized 1-query emergency lookup. The hardened Next.js server depends on these functions being installed.

## Server environment (Vercel or another trusted Node.js host)

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_PRIVATE_SERVICE_ROLE_KEY
VITAL_ID_SESSION_SECRET=GENERATE_AT_LEAST_32_RANDOM_CHARACTERS
VITAL_TRUST_PROXY_IP_HEADERS=true
VITAL_CLIENT_IP_HEADER=x-vercel-forwarded-for
```

Never put a service-role key in a `NEXT_PUBLIC_*` variable. Only set `VITAL_TRUST_PROXY_IP_HEADERS=true` when a proxy you trust overwrites the named IP header; otherwise leave it false, and configure ingress/WAF before production. **Do not set the old `VITAL_ID_DEMO_OTP` variable**: Cloud clinician sessions require owner-created temporary FULL share links. OTP `4827` remains only for a local offline demo.

## Setup before production

Protect your deployment with HTTPS, WAF/bot mitigation, correct CDN cache settings and a tested backup/restore strategy. Verify Storage `medical-documents` remains private and uploads obey the rules. Clean expired rate-limit rows on a schedule. Keep serverless function instances and DB connection capacity within your subscription limits.

**Review `HARDENING_DEPLOY_AR.md` for detailed deployment instructions and authorization, privacy, and load-testing checklists.**
