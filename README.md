# TaskFlow Dashboard

TaskFlow is a production-ready task management dashboard built with Next.js App Router, TypeScript, Prisma, PostgreSQL, TanStack Query, Tailwind CSS, and shadcn-style UI primitives.

## Features

- Secure registration, login, logout, and protected dashboard routes
- Cookie-based JWT session handling
- Dashboard metrics with real-time updates
- Task CRUD, completion toggling, search, and status filters
- Prisma-backed REST APIs with validation and ownership checks
- ESLint and Prettier configuration for consistent code quality

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- TanStack Query
- Tailwind CSS v4
- Zod

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and update it with your PostgreSQL connection string and JWT secret:

```bash
cp .env.example .env
```

3. Generate Prisma Client:

```bash
npm run prisma:generate
```

4. Run your Prisma migration against PostgreSQL:

```bash
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint
- `npm run format` formats the repo with Prettier
- `npm run prisma:generate` regenerates Prisma Client
- `npm run prisma:migrate` runs Prisma migrations in development

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
