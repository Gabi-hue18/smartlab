# SmartLab — Production Web App

A real, usable laboratory equipment maintenance and asset management system built from the SmartLab SRS.

## What is included

- Email/password authentication
- Role model for Admin / Laboratory Staff / Technician
- Equipment CRUD and asset registry
- Real QR code generation for every equipment record
- Real camera QR scanning in supported browsers
- Fault reporting that can create corrective maintenance work
- Preventive maintenance scheduling and kanban workflow
- Equipment status updates when maintenance starts/completes
- Calibration and warranty dates
- Document upload hook for Supabase Storage
- Maintenance history
- Notifications
- Analytics and CSV export
- Equipment health score / smart attention rules
- Responsive layout and dark mode
- GitHub Pages deployment workflow
- Supabase PostgreSQL schema + Row Level Security policies
- Demo mode that works immediately without Supabase

## 1. Run immediately in demo mode

```bash
npm install
npm run dev
```

Use:

- Admin: `admin@smartlab.com` / `admin123`
- Staff: `staff@smartlab.com` / `staff123`
- Technician: `tech@smartlab.com` / `tech123`

Demo mode stores changes in browser localStorage. It is useful for development but is not multi-user.

## 2. Turn it into the real shared website with Supabase

Create a Supabase project, then run `supabase/schema.sql` in the SQL Editor. Optionally run `supabase/seed.sql` after creating at least one user.

Create real users from Supabase Authentication. The trigger creates their profile automatically. You can change roles in the `profiles` table to `admin`, `staff`, or `technician`.

Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Never put the Supabase Service Role key in this frontend or in GitHub Pages.

Then run:

```bash
npm run dev
```

The app automatically switches from Demo mode to Cloud database mode.

## 3. Deploy using GitHub Pages

Create a GitHub repository named **smartlab**. Push this project to `main`.

In GitHub:

1. Settings → Secrets and variables → Actions → New repository secret.
2. Add `VITE_SUPABASE_URL`.
3. Add `VITE_SUPABASE_ANON_KEY`.
4. Settings → Pages → Source: **GitHub Actions**.
5. Push to `main` or run the workflow manually.

The included `.github/workflows/deploy-pages.yml` builds and deploys the app.

### If your repository is not named `smartlab`

Edit `vite.config.js` and change:

```js
base: process.env.GITHUB_ACTIONS ? '/smartlab/' : '/'
```

to your repository name, for example `/my-lab-system/`.

## 4. Recommended production hardening

Before using this for a real institution:

- Review the RLS policies for your college's exact authorization rules.
- Add backup/retention policies.
- Use private signed URLs for sensitive documents instead of public URLs.
- Add email/SMS notifications via an Edge Function or trusted backend.
- Add audit triggers for write operations.
- Add rate limiting and stronger password policies.
- Use a custom domain if desired.

## Folder structure

- `src/` React application
- `supabase/schema.sql` PostgreSQL schema, auth profile trigger and RLS
- `supabase/seed.sql` sample asset data
- `.github/workflows/deploy-pages.yml` GitHub Pages deployment

