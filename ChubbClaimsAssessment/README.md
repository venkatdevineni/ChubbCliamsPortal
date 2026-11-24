# Chubb APAC Claims Portal — Assessment MVP

This is a starter implementation based on the provided Frontend Developer assessment brief. Angular is used for both claimant and staff views; the role switch demonstrates different UX priorities within one codebase.

## Stack
- Angular 18 standalone components + HttpClient + Forms
- ASP.NET Core Minimal API (.NET 8) mock backend
- REST endpoints for claims; a lightweight in-memory event journal (`/api/events`) represents Kafka-style domain events without requiring Kafka locally

## Run locally (Windows / PowerShell)

### 1) Backend
```powershell
cd backend\Claims.Api
dotnet restore
dotnet run --urls http://localhost:5000
```

### 2) Frontend (separate terminal)
```powershell
cd frontend
npm install
npm start
```
Open http://localhost:4200.

## Demo flow
1. Start in Staff view; overview tiles summarize open work, document follow-ups, exposure, and count.
2. Select a claim in the queue to see detail and latest update.
3. Try quick actions to progress the claim status. The backend updates the record and adds an event to its mock event journal.
4. Switch to Claimant view; create a new claim and see its reference appear in the list.
5. Filter by status or search by claim reference, claimant, type, or location.

## API
- `GET /api/health`
- `GET /api/claims`
- `GET /api/claims/{id}`
- `POST /api/claims`
- `PATCH /api/claims/{id}/status`
- `GET /api/events`

## Architecture and trade-offs
- **One Angular app, role-specific experience:** keeps shared claim data and presentation primitives consistent while letting staff and claimants use different actions and information density. Role selection is a demo toggle, not production authentication/authorization.
- **Service boundary:** components call `ClaimsService`; HTTP concerns remain out of the UI. A real backend would validate, authorize, persist, and publish events.
- **Async states:** loading, API error, success notices and empty search results are surfaced. This MVP does not implement retry/backoff, optimistic concurrency, or server-side paging.
- **Mock data:** in-memory state resets when the backend restarts. No database is configured.
- **Kafka representation:** API writes create domain event records in an in-memory queue. This is illustrative only; it is not a Kafka broker integration.
- **Scope:** prioritize a functional claim intake, queue, details, status updates and simple dashboard. Uploads, authentication, multi-market localization, SLA metrics, real audit trail, and automated tests are intentionally not implemented.

## Before submitting
- Run and test the app on your machine; don't submit code you haven't inspected.
- Replace or expand mock seed data, improve validations and error handling, and add tests as time permits.
- Add meaningful Git commits. This folder is not itself a Git repository.
- Update `AI_WORKING_JOURNAL.md` to reflect your actual AI interactions, what you accepted/challenged/changed, and your own rationale. The starter journal is not a fabricated record of your process.

## Reliable local startup (Windows)

Use **two separate PowerShell windows** and keep both open. The Angular frontend uses a proxy for `/api` requests to avoid hard-coded ports and browser CORS issues.

### Terminal 1 — Backend API

```powershell
.\backend-start.ps1
```

The API listens on `http://localhost:5000`. Check it with `http://localhost:5000/api/health`.

### Terminal 2 — Angular frontend

```powershell
.\frontend-start.ps1
```

Open `http://localhost:4200`. If port 4200 is already in use, do not start a second Angular instance; return to the browser tab already using that port.

### If ports are occupied

```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :4200
```

Stop only a duplicate process you started, or use the existing server.
