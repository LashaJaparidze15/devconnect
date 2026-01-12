# Copilot / Agent Instructions — DevConnect

This file captures the minimal, actionable knowledge an AI coding agent needs to be productive in this repository.

## Big picture
- Monorepo-like layout: top-level server folder (`server/`) hosts the Express API; `client/` hosts a Vite + React frontend. The root `package.json` contains server-side dependencies (Express, Mongoose, Passport, socket.io) while `client/package.json` contains the frontend deps and Vite dev scripts.
- Data & auth hints: `mongoose`, `jsonwebtoken`, `passport`, and `passport-github2` are installed — expect DB connection, JWT secrets, and GitHub OAuth credentials to be provided via environment variables (common names: `MONGO_URI`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).

## Quick dev commands
- Install server deps (root):

  npm install

- Start server (simple):

  node server/server.js

- Start server with auto-reload (no script provided):

  npx nodemon server/server.js

- Frontend (from repo root):

  cd client
  npm install
  npm run dev

Notes: There is no `start` script for the API in the root `package.json`. Agents may add a `scripts` entry like `dev-server` to make local workflows reproducible.

## Key files to inspect (examples)
- Server entry: `server/server.js` — simple Express app; middleware and a test `/` route are defined here.
- Frontend entry: `client/src/main.jsx` and `client/src/App.jsx` — Vite + React minimal app; HMR is expected.
- Vite config: `client/vite.config.js` — standard setup using `@vitejs/plugin-react`.

## Project-specific patterns & gotchas
- Dependency split: server packages live in root `package.json`; client has its own `package.json`. When running the server, ensure root `node_modules` is installed (run `npm install` at repo root).
- Missing DB connect: `server/server.js` `require('mongoose')` is present but there is no visible `mongoose.connect(...)` call here — search for other files that may initialize DB or assume it's missing and add a connection step when implementing API features.
- OAuth & sockets: `passport-github2` and `socket.io` appear in dependencies; expect auth flows and realtime features to span server and client. Look for socket setup on both sides when adding features.
- ESLint: client has an `eslint` setup and `eslint.config.js`; respect the linting conventions when changing frontend code.

## What agents should do first (practical checklist)
1. Run `npm install` at repo root and `cd client && npm install`.
2. Start the frontend (`cd client && npm run dev`) and confirm Vite serves the app at `localhost:5173` (default).  
3. Start the API (`npx nodemon server/server.js` or `node server/server.js`) and confirm `GET /` returns the JSON message.
4. Search repo for any DB or auth initializers (`mongoose.connect`, `passport.use`, socket setup) before adding features.
5. If adding long-running or infra changes, update `package.json` scripts and document the new commands in this file.

## Example actionable edits (short starters)
- Add DB connect in `server/server.js` if missing, using `process.env.MONGO_URI`.
- Add a root `scripts` entry: `"dev-server": "npx nodemon server/server.js"` to make server start reproducible.

## Where to look for more context
- Frontend UI and routing: `client/src/`  
- Server routes and models (if added later): `server/`  
- Repo-level deps and dev tools: `package.json` (root) and `client/package.json`

If anything above is unclear or you'd like me to include CI/workflow examples (GitHub Actions), tell me which workflow you'd prefer and I'll iterate.
