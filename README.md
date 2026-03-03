## SmartCampusTech – Web Engineering Studio

Production-ready Next.js 14 foundation for the SmartCampusTech brand.

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion  
- **Backend**: Next.js API Routes, Node.js architecture  
- **Database**: MongoDB Atlas (see `src/lib/mongodb.ts`)  

### Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with a valid `MONGODB_URI` and optional `NEXT_PUBLIC_SITE_URL`.

4. Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the SmartCampusTech marketing site.

### Secure admin panel

- **Admin login route**: `/secure-admin-login` (not linked from the public navigation; share this URL only with trusted admins).
- On first run, set the following env vars to seed an initial admin user:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
  - `ADMIN_JWT_SECRET` (long random string)
- After login, the admin dashboard is available at `/secure-admin`.

### Environment variables

- **Core**
  - `MONGODB_URI` – MongoDB Atlas connection string
  - `NEXT_PUBLIC_SITE_URL` – Public canonical URL (e.g. `https://smartcampustech.com`)
- **Google Analytics**
  - `NEXT_PUBLIC_GA_ID` – GA4 measurement ID (e.g. `G-XXXXXXXXXX`)
- **Google Drive (service account)**
  - `GOOGLE_DRIVE_CLIENT_EMAIL`
  - `GOOGLE_DRIVE_PRIVATE_KEY` – remember to keep newlines escaped in `.env` (`\n`)
  - `GOOGLE_DRIVE_PROJECT_IMAGES_FOLDER_ID`
  - `GOOGLE_DRIVE_CLIENT_ASSETS_FOLDER_ID`
  - `GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID`
- **Admin auth**
  - `ADMIN_EMAIL` – initial admin email (used only once to seed)
  - `ADMIN_PASSWORD` – initial admin password (used only once to seed; change later directly in DB if needed)
  - `ADMIN_JWT_SECRET` – long random string for signing admin JWTs

See `.env.local.example` for a ready-to-copy template.

### Google Drive API setup

1. Create a Google Cloud project and enable the **Google Drive API**.  
2. Create a **service account**, then generate a **JSON key**.
3. From the JSON, copy:
   - `client_email` → `GOOGLE_DRIVE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_DRIVE_PRIVATE_KEY` (convert newlines to `\n` before pasting into `.env`).
4. In Google Drive, create three folders:
   - Project images
   - Client assets
   - Documents
5. Share each folder with the service account email and copy the folder IDs into:
   - `GOOGLE_DRIVE_PROJECT_IMAGES_FOLDER_ID`
   - `GOOGLE_DRIVE_CLIENT_ASSETS_FOLDER_ID`
   - `GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID`
6. The admin-only endpoint `/api/uploads/drive` will now upload files into the right folder and store public links in MongoDB.

### Deployment

- **Frontend + backend (Next.js)**
  - Recommended: deploy to **Vercel**.
  - Connect the repository, select the project, and ensure:
    - `root` is the repository root (contains `next.config.mjs`).
    - Build command: `next build`
    - Output: `.next`
  - Add all environment variables in Vercel Project Settings → Environment Variables.
  - All API routes under `src/app/api` (including admin and Drive upload routes) run as serverless functions.
- **Alternative backend**
  - If you prefer hosting APIs separately (e.g. Render), you can:
    - Extract API routes into a dedicated Next.js / Node service.
    - Reuse `src/lib/mongodb.ts`, `src/lib/models.ts`, and `src/lib/repositories.ts`.
    - Point `MONGODB_URI` to the same MongoDB Atlas cluster.
- **Database**
  - Use **MongoDB Atlas** with an IP allowlist that includes Vercel / Render.
  - Create a database named `smartcampustech` (or update `DB_NAME` constants accordingly).

### Default admin creation

- On first `POST /api/admin/login` call, if no admin exists and `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set, an admin user is automatically created with:
  - `email = ADMIN_EMAIL`
  - `passwordHash = bcrypt(ADMIN_PASSWORD)`
- After seeding, you can:
  - Log in at `/secure-admin-login`.
  - Optionally rotate password by updating the `admins` collection directly (hash with bcrypt) or adding dedicated admin management later.

### Backup guide

- **MongoDB Atlas**
  - Enable automated backups in Atlas for point-in-time recovery.
  - For manual backups, periodically export collections:
    - `projects`, `leads`, `testimonials`, `websiteContent`, `admins`, `adminActivityLogs`.
  - Store exports in a secure, access-controlled storage (e.g. S3, Google Cloud Storage).
- **Google Drive**
  - Project images, client assets, and documents live in three dedicated folders.
  - Use Google Workspace backup tools or periodically copy these folders to another Drive or storage bucket.
- **Application**
  - Keep the codebase in a Git repository (GitHub / GitLab), with branch protection and regular tags for releases (e.g. `v1.0.0`).


