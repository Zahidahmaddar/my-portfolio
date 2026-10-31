# Zahid Farooq: portfolio

Personal portfolio with an admin panel and an AI chatbot, built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and MongoDB.

## Features

- **Public site**: server-rendered with a light and dark theme. Admin edits go live immediately.
- **Admin panel** (`/admin`): manage projects, skills, site content, chatbot notes and contact messages, and reply to messages by email.
- **Chatbot**: streams answers from NVIDIA-hosted models, using your projects, skills, About text and notes. If the chosen model is retired, it falls back to another one.
- **Contact form**: saves messages and sends email notifications, with a honeypot and rate limits against spam.

## Getting started

Requires Node.js 20.6 or later and a MongoDB database.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run create-admin         # creates the admin login from ADMIN_EMAIL and ADMIN_PASSWORD
npm run dev
```

The site runs at http://localhost:3000, and the admin panel at http://localhost:3000/admin.

Running `npm run create-admin` again updates the password of an existing admin.

## Environment variables

`.env.example` lists every variable. Keep real values in `.env.local`, which git ignores.

## Testing

```bash
npx playwright install chromium   # first time only
npm run test:e2e
```

The tests build the app and run it against a temporary in-memory MongoDB. They never connect to the database in your env files, never send real email, and don't call the chatbot's AI provider or Cloudinary. Use `npx playwright show-report` to see the results.

## Project layout

```
src/app/(site)       public page
src/app/admin        login and dashboard
src/app/api          API routes
src/components/site  public page sections
src/components/admin dashboard tabs and shared UI
src/lib              database, email, chatbot, models
e2e                  Playwright tests
```

## Deployment

Works on Vercel or any Node.js host. Set the variables from `.env.example`, including `NEXT_PUBLIC_SITE_URL`. Rate limits are kept in memory per server instance, so they are best-effort on serverless hosts.
