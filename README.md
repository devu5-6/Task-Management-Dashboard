# TaskFlow Dashboard

TaskFlow Dashboard is a production-ready task management application built for the assignment requirements. It allows users to register, log in securely, manage daily tasks, and track completion metrics from a responsive dashboard.

## Features

- User registration, login, logout, and protected dashboard access
- JWT-based session handling with HTTP-only cookies
- Dashboard metrics for total, completed, pending, and completion percentage
- Create, edit, delete, and update task status
- Search tasks and filter by status
- Responsive UI built with Tailwind CSS and reusable shadcn-style components
- Prisma + PostgreSQL persistence
- TanStack Query for fetching, caching, optimistic updates, and invalidation

## Application Screenshots

### Register Screen -

![Register Screen](./public/screenshots/register.png)

### Dashboard Screen -


![Dashboard-1](./public/screenshots/dashboard-1.png)
![Dashboard-2](./public/screenshots/dashboard-2.png)

## Live Deployment

Vercel deployment:

```text
https://task-management-dashboard-dusky-pi.vercel.app
```


## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- PostgreSQL
- Prisma ORM
- TanStack Query
- Tailwind CSS v4
- Zod
- ESLint
- Prettier

## Project Structure

```text
src/
|-- app/
|-- components/
|-- features/
|-- hooks/
|-- services/
|-- lib/
|-- types/
`-- utils/
```

## Environment Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Required variables:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME"
JWT_SECRET="your-long-random-secret"
```

Notes:

- `DATABASE_URL` must point to a running PostgreSQL database.
- `JWT_SECRET` should be a long random string.
- For local development, `NODE_ENV` is optional because Next.js sets it automatically.

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run database migrations

```bash
npm run prisma:migrate
```

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates the production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run format` runs Prettier
- `npm run prisma:generate` regenerates Prisma Client
- `npm run prisma:migrate` runs Prisma development migrations

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

## Architecture Decisions

### 1. Next.js App Router

The application uses the App Router to keep routing, server rendering, layouts, and API route handlers in a single framework. This keeps the submission cohesive and production-oriented.

### 2. Feature-based frontend organization

Feature-specific UI is grouped under `src/features`, while shared building blocks live in `src/components`. This keeps dashboard-specific code separated from auth-specific code and improves maintainability.

### 3. JWT authentication with HTTP-only cookies

Authentication uses signed JWTs stored in HTTP-only cookies rather than localStorage. This improves security for session handling and supports protected routes through server-side checks.

### 4. Route protection in two layers

Protected access is handled both:

- at the routing level through `proxy.ts`
- at the server/page level through auth helpers such as `requireUser`

This reduces the chance of accidental exposure.

### 5. Prisma as the data access layer

Prisma was chosen for type-safe database access, schema management, and cleaner service-layer implementation. The task schema now enforces a database enum for `status` and a non-null `description`, which better matches the assignment contract.

### 6. TanStack Query for task state

TanStack Query is used for:

- server data fetching
- client-side caching
- optimistic updates
- error handling
- cache invalidation after mutations

This keeps task interactions responsive without duplicating server state manually across components.

### 7. Validation at the API boundary

Zod schemas validate auth and task payloads before they reach business logic. This keeps route handlers predictable and ensures meaningful error messages for invalid input.

## Assumptions Made

- Search and status filtering are supported in the product, with the current UX focused on a responsive dashboard experience rather than advanced query-builder behavior.
- The project assumes PostgreSQL is available locally or via a reachable connection string at runtime.

## Verification

The project has been verified with:

```bash
npm run lint
npm run build
```

## Submission Notes

- Complete source code is included in the repository.
- The app follows the requested stack and project structure.
