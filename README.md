# 🎓 CollegeFinder — College Discovery Platform

A full-stack college discovery platform built with Next.js, TypeScript, PostgreSQL, and Prisma.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **Auth**: NextAuth.js with JWT + bcrypt

## Features
- 🔍 College Listing with Search & Filters
- 📋 College Detail Page (Overview, Courses, Placements, Reviews)
- ⚖️ Side-by-side College Comparison (up to 3)
- 🔖 Save/Unsave Colleges (auth required)
- 🔐 Auth: Register, Login, Sessions

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Neon Database
1. Go to https://neon.tech → Sign up → Create project → name it `college-discovery`
2. Copy the connection string

### 3. Configure environment
Copy `.env.example` to `.env` and fill in:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXTAUTH_SECRET="any-random-string-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Push schema & seed data
```bash
npm run db:push
npm run db:seed
```

### 5. Run the app
```bash
npm run dev
```
Open http://localhost:3000

### Test Login
- Email: `test@example.com`
- Password: `password123`

---

## Deployment (Vercel + Neon)

1. Push to GitHub
2. Go to https://vercel.com → New Project → Import repo
3. Add environment variables:
   - `DATABASE_URL` (use Neon pooled connection URL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your vercel URL, e.g. https://your-app.vercel.app)
4. Deploy!

---

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/         # Login, Register, NextAuth
│   │   ├── colleges/     # List + Detail APIs
│   │   ├── compare/      # Compare API
│   │   └── saved/        # Save/Unsave API
│   ├── auth/             # Login & Register pages
│   ├── colleges/         # Listing + Detail pages
│   ├── compare/          # Comparison page
│   └── saved/            # Saved colleges page
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/CollegeCard.tsx
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── auth.ts           # NextAuth config
prisma/
├── schema.prisma         # DB schema
└── seed.ts               # Seed data
```

## Architecture Decisions
- **Next.js App Router**: Server + client components, file-based routing
- **API Routes**: RESTful endpoints colocated with frontend
- **Prisma**: Type-safe ORM, easy migrations
- **JWT sessions**: Stateless, no session DB needed
- **Client-side filtering**: Instant UX with server-side pagination
