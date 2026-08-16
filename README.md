# Quran Academy

Production-ready Quran Academy website built with Next.js 15, TypeScript, Tailwind CSS, Prisma and PostgreSQL. The public site is Kyrgyz-first and the architecture is ready for Russian and English content.

## Setup

1. Copy `.env.example` to `.env` and fill in the PostgreSQL connection string and a long `JWT_SECRET`.
2. Install packages: `npm install`.
3. Create the schema: `npm run db:push`.
4. Seed the admin account and academy information: `npm run db:seed`.
5. Start locally: `npm run dev`.

For production startup, set `ADMIN_EMAIL` (defaults to `010421aziz@gmail.com`) and a strong `ADMIN_PASSWORD` in the deployment environment. The `start` script applies pending migrations and creates the admin account only when that email does not already exist; it never overwrites an existing admin password.

Initial admin account: `admin@quranacademy.kg` / `ChangeMe123!`. Change this credential before deployment.

## Content management

Visit `/dashboard/login` to manage teachers, programs, gallery records and incoming contact messages. API mutations are protected with an HTTP-only JWT cookie and input is validated with Zod.

Set `UPLOAD_PATH` to your persistent storage directory for a deployment target. For Vercel production, connect an object store (such as Supabase Storage or S3) and store public asset URLs in the gallery/teacher records; filesystem uploads are not durable on Vercel.

## Deployment

`npm run build` generates Prisma Client then builds the production app. Configure the same environment variables on Vercel, Railway, Render or your Supabase-connected host. Run `npm run db:push` as part of first deployment/database provisioning.

## Image asset

The default hero is at `public/images/hero-graduation.png`, generated for this project. Replace it from the content model when actual academy photography is available.
