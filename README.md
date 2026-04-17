# Contact App Flow - Developer Challenge

## Description
Full-stack contact management app built for the UX Studio developer challenge, focusing on clean UI, reusable components, and smooth CRUD flows.

The app supports adding, editing, and removing contacts, with avatar upload and responsive layout.

## Tech Stack
- Frontend: React, TypeScript, Vite, CSS Modules
- Backend: Node.js, Express, SQLite (`sqlite3`)

## Run locally
### 1. Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### 2. Start backend
```bash
cd server
npm run dev
```
Backend URL: `http://localhost:4000`

### 3. Start frontend
```bash
cd client
npm run dev
```
Frontend URL (default): `http://localhost:5173`

### Lighthouse check (recommended)
For reliable Lighthouse scores, run the frontend in production preview mode instead of `npm run dev`:

```bash
cd client
npm run build
npm run preview -- --host
```

Preview URL (default): `http://localhost:4173`

## Database notes
- SQLite database file is created at `server/data/contacts.db`.
- Table: `contacts`
- Columns: `id`, `name`, `phone`, `email`, `avatar`
- API returns contacts ordered by ascending `id`.
- `avatar` is stored as a base64 string in SQLite.
- Only `name` is required; `phone`, `email`, and `avatar` are optional.

## Seed data
- On server startup, seed contacts are inserted automatically only when the `contacts` table is empty.
- Current seed inserts 5 design-matching contacts.
- Seed avatars are loaded from `client/src/assets/images`, then stored in SQLite as base64 data URIs.
- Seed records currently include phone numbers and avatar images; emails are `null`.
- If a seed image is missing, the default avatar image is used as fallback.
- To re-run seed from scratch, delete `server/data/contacts.db` and restart the backend.

## What I would improve next
- Add lightweight API tests for CRUD endpoints.
- Add search and pagination support for larger contact lists.
- Add avatar size constraints/compression before storing base64 data.
