# Project Documentation

## Overview

This repository is a small full-stack web application that demonstrates a user-management UI backed by an API. It includes:

- A Next.js (app router) TypeScript frontend that renders paginated, searchable tables of users using AG Grid.
- A NestJS backend (with Sequelize and PostgreSQL) exposing REST endpoints under `/api/users` for listing, searching, and managing users (and their associated "objects").
- Utility code and small client services for API interaction.

Purpose: this project is a practical example of building a data-driven admin UI with server-side pagination, searching, and import tooling.

---

## High-level architecture

- Client: Next.js 16 + React 19 (TypeScript). UI uses `ag-grid` (community) for performant tabular views. Axios (via a small wrapper) is used for HTTP calls. The Next app is expected to run on port 3000 in dev.

- Server: NestJS v11 application using `sequelize`/`sequelize-typescript` and PostgreSQL. It exposes JSON REST endpoints under `api/users`. The server runs on port 3001 by default and enables CORS for `http://localhost:3000`.

- Data flow: the frontend calls server endpoints with query parameters for pagination/search/sort; the server queries Postgres via Sequelize and returns `{ data, total }` responses which the client renders in AG Grid.

---

## Folder and file guide

- `app/`

  - `layout.tsx` — Root layout, global CSS, header/footer and fonts.
  - `page.tsx` — Home page that defines AG Grid columns and a `fetchUsers` function that calls the backend and renders `AGTable`.
  - `user/[userId]/page.tsx` + `UserDetailPageClient.tsx` — Per-user detail route components (client-side rendering for details).

- `components/`

  - `AGTable.tsx` — Generic AG Grid wrapper used by pages. Handles simple paging, search input, loading state, and configuration. Consumes a `fetchData` callback returning `{ data, total }`.
  - `DataTable.tsx` — More feature-rich table component: supports server-side sort/filter/search, debounced fetches, and more configurable controls.
  - `UsersTable.tsx` — Example integration of the table with a user object dataset.
  - `Header.tsx`, `Footer.tsx`, `Spinner.tsx` — UI shell and utilities.

- `hooks/`

  - `useApi.ts` — A small React hook that wraps `apiRequest` (from `lib/apiClient`) to expose `request`, `loading`, and `error` for components.

- `lib/`

  - `apiClient.ts` — Normalizes Axios responses into an `ApiResult<T>`: `{ success: boolean, data?, error? }`.
  - `axios.ts` — (internal) config for the axios instance (baseURL, interceptors); used by the `apiClient`.

- `services/`

  - `userService.ts` — Client-side wrapper exposing `listUsers` which calls `http://localhost:3001/api/users` (via `apiRequest`).

- `server/` (NestJS)

  - `src/main.ts` — Bootstraps the Nest application, enables CORS for `http://localhost:3000`, and listens on port `3001` by default.
  - `src/app.module.ts` — Registers Sequelize (Postgres) and feature modules: `UsersModule` and `ObjectsModule`.
  - `src/users/` — User feature module:
    - `users.controller.ts` — Controller exposing endpoints for listing, searching, getting single user, CRUD and importing JSON data.
    - `users.service.ts` — Business logic using Sequelize models. Implements `findAll`, `getUsersWithObjects`, `findOne`, `create`, `update`, `remove`, and `importFromFile` (JSON import/upsert).
    - `user.model.ts` — Sequelize `User` model and attributes with a `HasMany` association to `ObjectModel`.

- `public/` and `styles/` — static assets and global styling.

---

## Data model

User model fields (examples):

- `userId` (PK), `userName`, `userEmail`, `Active`, `ExpiryDate`, `Privileges`, `apiAccess`, `registrationDate`, `lastLogin`, `ipAddress`, `subAccounts`, `objectCount`, `Email`, `Sms`, `Webhook`, `API`.

Relation: `User` hasMany `ObjectModel` (devices/objects). The server supports including associated objects on queries.

---

## API contract and client expectations

- Server endpoints (examples):

  - `GET /api/users` — list users. Query params supported: `page`, `limit` (or `pageSize` from client), `sortField`, `sortOrder`, `filterField`, `filterValue`, `search`.
  - `GET /api/users/all` — list users and include objects.
  - `GET /api/users/:id` — get single user (includes objects).
  - `POST /api/users/import` — import users from a JSON file on the server.

- Response shape used by client components:

  - `{ data: T[], total: number }` where `data` is an array of user rows and `total` is the total number of records for pagination.

- Client `fetchData` contract: function receiving `{ page, pageSize, search }` and returning `Promise<{ data, total }>`.

- API client `apiRequest(config)` returns `ApiResult<T>`:
  - `{ success: boolean, data?: T, error?: { message: string, status?: number, details?: any } }`.

---

## How to run (development)

1. Frontend (Next):

```bash
# from project root
npm install
npm run dev
```

This starts the Next dev server. By default it serves the app at `http://localhost:3000`.

2. Backend (Nest):

```bash
# in separate terminal
cd server
npm install
npm run start:dev
```

This starts the Nest dev server on port `3001` by default and enables CORS for `http://localhost:3000`.

Notes:

- The server expects a PostgreSQL database for persistent storage. Environment variables used by `server/src/app.module.ts`:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (defaults are provided for local dev: `localhost`, `5432`, `postgres`, `root`, `autotrackerdb`).
- For quick local testing without Postgres, the server may still start but endpoints requiring DB will fail; consider using Docker Compose (next section) or a local Postgres instance.

---

## Implementation notes & notable details

- Two table components exist:

  - `AGTable` — minimal, used on the home page. It expects a `fetchData` function and handles search and pagination.
  - `DataTable` — more advanced, supports server-side sort/filter/search, debounced fetching, and custom toolbar.

- Server search uses Sequelize `Op.iLike` to perform case-insensitive partial matches across multiple fields (`userId`, `userName`, `userEmail`, `Privileges`, `ipAddress`).

- Import flow (`UsersService.importFromFile`) reads a JSON file, transforms records, upserts users, and bulk-upserts objects. It currently upserts objects per-user and includes commented code to batch-insert.

---

## Edge cases & recommendations

Edge cases:

- Large imports can create heavy DB load; batch upserts and transactions are recommended.
- If front-end and back-end are served from different origins, ensure CORS config is kept in sync.
- When sorting/filtering on fields not indexed in Postgres, queries can be slow—consider indexing frequently-searched fields (`userId`, `userName`, `userEmail`).

---
