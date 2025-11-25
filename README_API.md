# FairFound Frontend – Backend API Requirements (v1)

This document lists all REST API endpoints the frontend expects for the Freelancer industry (current implemented UI). It defines request/response payloads, status codes, and error conventions so backend developers can implement consistently. All endpoints are namespaced under `/api/v1` (unless stated otherwise). JSON is UTF-8 encoded. Times are ISO-8601 timestamps.

## General Conventions
- Base URL: `https://<backend-host>/api/v1`
- Authentication: Bearer JWT in `Authorization: Bearer <token>` header (after login/registration). Public endpoints are noted.
- Content-Type: `application/json` for request bodies (except file upload endpoints – none defined yet).
- Boolean flags use `camelCase`.
- Collections may support pagination: `?page=<number>&pageSize=<number>`; response includes `meta` block.
- Numeric scores are integers 0–100 unless explicitly stated.
- All IDs are UUID strings unless generated otherwise.
- Time fields end with `At` and are ISO strings.

## Error Format (Unified)
On any non-2xx response:
```json
{
  "error": {
    "code": "string",          // machine readable e.g. VALIDATION_ERROR, NOT_FOUND
    "message": "Human readable",// short message
    "details": [                 // optional array of field-level issues
      { "field": "email", "issue": "Must be a valid email" }
    ]
  }
}
```
Common status codes: 400 (validation), 401 (unauthenticated), 403 (forbidden), 404 (not found), 409 (conflict), 422 (semantic), 429 (rate limit), 500 (server).

## Domain Schemas (Frontend Expectations)
These derive from `src/types/domain.ts` and extended UI needs.

```jsonc
// User
{
  "id": "string",          // UUID
  "name": "string",
  "email": "string",       // unique
  "createdAt": "string"    // ISO timestamp
}

// FreelancerMetrics
{
  "profileCompleteness": 0,  // number (0-100)
  "profileViews": 0,         // integer
  "proposalSuccessRate": 0,  // % integer 0-100
  "jobInvitations": 0,       // integer
  "hourlyRate": 0,           // number (USD)
  "skills": ["React", "TypeScript"], // array of strings
  "portfolioItems": 0,       // integer count
  "repeatClientsRate": 0     // % integer 0-100
}

// ComparisonResult
{
  "userMetrics": <FreelancerMetrics>,
  "topFreelancersAverage": <FreelancerMetrics>,
  "competitorMetrics": <FreelancerMetrics | null>,
  "fairRanking": 0,          // integer 0-100 (derived)
  "tier": "Emerging" | "Competitive" | "Top-tier ready"
}

// RoadmapMilestone
{
  "id": "string",            // UUID
  "title": "string",
  "description": "string",
  "estimatedEffort": "string", // e.g. "2h", "Medium"
  "completed": false,
  "order": 1
}

// SWOT item (UI groups by category; backend returns canonical list)
{
  "category": "Strength" | "Weakness" | "Opportunity" | "Threat",
  "title": "string",
  "description": "string"
}
```

Additional derived frontend blocks:
```jsonc
// Suggestion Item
{ "title": "Learn Next.js", "impact": "High", "effort": "Medium" }

// Trending Skill Entry
{ "name": "Next.js", "demand": "Very High" }
```

---
## 1. Authentication & User
### 1.1 Register
POST `/auth/register` (public)
```json
{ "name": "string", "email": "string", "password": "string" }
```
Responses:
- 201 Created:
```json
{ "user": <User>, "token": "jwt-string" }
```
- 409 if email exists.

### 1.2 Login
POST `/auth/login` (public)
```json
{ "email": "string", "password": "string" }
```
200 OK:
```json
{ "user": <User>, "token": "jwt-string" }
```

### 1.3 Get Current User
GET `/auth/me` (auth)
200 OK:
```json
{ "user": <User> }
```

### 1.4 Logout
POST `/auth/logout` (auth) – invalidates JWT (if using server blacklist) or returns 204 No Content.

### 1.5 OAuth Begin / Callback (Optional Future)
- GET `/auth/oauth/:provider/redirect`
- GET `/auth/oauth/:provider/callback?code=...`
Front-end expects standardized redirect final payload identical to login response.

---
## 2. Industry Selection / Onboarding
### 2.1 List Industries
GET `/industries` (public)
200 OK:
```json
{ "industries": [ { "name": "Freelancer", "available": true }, { "name": "E-commerce", "available": false } ] }
```

### 2.2 Select Industry
POST `/user/industry` (auth)
```json
{ "industry": "Freelancer" }
```
200 OK:
```json
{ "selectedIndustry": "Freelancer" }
```
Valid values: `Freelancer`, `E-commerce`, `Developer`, `Business`.

### 2.3 Join Waitlist (for unavailable industry)
POST `/waitlist` (public)
```json
{ "email": "string", "industry": "E-commerce" }
```
202 Accepted:
```json
{ "status": "queued" }
```

---
## 3. Freelancer Profile & Metrics
### 3.1 Get Profile Metrics
GET `/freelancer/profile` (auth)
200 OK:
```json
{ "metrics": <FreelancerMetrics> }
```
If absent backend initializes defaults.

### 3.2 Update Profile Metrics (Partial)
PATCH `/freelancer/profile` (auth)
Body allows any subset of metrics except derived fields:
```json
{ "hourlyRate": 80, "skills": ["React", "TypeScript", "Next.js"], "profileCompleteness": 76 }
```
200 OK returns full metrics.

### 3.3 Manage Skills
- POST `/freelancer/skills`:
```json
{ "skills": ["Docker", "CI/CD"] }
```
Returns updated list.
- DELETE `/freelancer/skills/:skill` removes skill by exact match (URL encoded). 204 No Content.

### 3.4 Increment View / Invitation Counters (optional instrumentation)
POST `/freelancer/profile/views` – increments `profileViews`. 202 Accepted.
POST `/freelancer/profile/invitations` – increments `jobInvitations`. 202 Accepted.

### 3.5 Fair Ranking (Calculated)
GET `/freelancer/fair-ranking`
200 OK:
```json
{ "fairRanking": 72, "tier": "Competitive" }
```
Backend formula should approximate frontend logic (weights from `ProfileComparisonPage.tsx`).

---
## 4. Comparison Engine
### 4.1 Compare Against Market / Competitor
GET `/freelancer/comparison?role=web-developer&competitorUrl=https://...` (auth)
Query Params:
- `role` (required) – one of: `web-developer`, `graphic-designer`, `content-writer`, `marketing`.
- `competitorUrl` (optional) – public profile URL to fetch competitor metrics (scraped or stubbed).
200 OK:
```json
{
  "comparison": <ComparisonResult>,
  "userScore": 68,               // raw aggregated score used for positioning bar
  "ranges": { "emerging": [0,59], "competitive": [60,79], "topTier": [80,100] }
}
```
404 if competitorUrl invalid/unreachable (still return averages without competitorMetrics).

---
## 5. Insights & AI Coach
### 5.1 SWOT & Suggestions
GET `/freelancer/insights` (auth)
200 OK:
```json
{
  "swot": [ { "category": "Strength", "title": "Strong React portfolio", "description": "..." } ],
  "suggestions": [ { "title": "Learn Next.js", "impact": "High", "effort": "Medium" } ],
  "trendingSkills": [ { "name": "Next.js", "demand": "Very High" } ],
  "focusRecommendation": "Prioritize Next.js and Node.js to become full-stack."
}
```

### 5.2 Regenerate Insights (Optional heavier AI call)
POST `/freelancer/insights/regenerate`
Body (optional filters):
```json
{ "focus": "frontend", "limit": 5 }
```
202 Accepted:
```json
{ "status": "processing", "requestId": "uuid" }
```
Later: GET `/freelancer/insights/status?requestId=uuid` → deliver same schema as 5.1 once ready.

---
## 6. Roadmap Management
### 6.1 List Milestones
GET `/freelancer/roadmap` (auth)
200 OK:
```json
{ "milestones": [ <RoadmapMilestone>, ... ], "progress": { "completed": 3, "total": 8, "percent": 37.5 } }
```

### 6.2 Create Milestone
POST `/freelancer/roadmap/milestones`
```json
{ "title": "Add case study project", "description": "Write detailed metrics", "estimatedEffort": "3h" }
```
201 Created:
```json
{ "milestone": <RoadmapMilestone> }
```
Backend assigns `order` sequentially.

### 6.3 Update Milestone
PATCH `/freelancer/roadmap/milestones/:id`
```json
{ "title": "Refine case study", "completed": true }
```
200 OK returns updated milestone.

### 6.4 Reorder Milestones
PATCH `/freelancer/roadmap/milestones/reorder`
```json
{ "orders": [ { "id": "uuid-1", "order": 1 }, { "id": "uuid-2", "order": 2 } ] }
```
200 OK:
```json
{ "milestones": [ ...reordered... ] }
```

### 6.5 Delete Milestone
DELETE `/freelancer/roadmap/milestones/:id` → 204 No Content.

### 6.6 Roadmap Progress Snapshot (optional explicit)
GET `/freelancer/roadmap/progress`
200 OK:
```json
{ "completed": 3, "total": 8, "percent": 37.5 }
```

---
## 7. Re-evaluation Flow
### 7.1 Trigger Re-evaluation
POST `/freelancer/re-evaluation` (auth)
Body (optional if user indicates which improvements applied):
```json
{ "appliedMilestoneIds": ["uuid-1", "uuid-2"], "profileChanges": { "portfolioItems": 12, "proposalSuccessRate": 22 } }
```
200 OK:
```json
{
  "previousRanking": 68,
  "newRanking": 76,
  "improvement": 8,
  "changedMetrics": [
    { "label": "Portfolio Items", "previous": 8, "current": 12, "unit": "projects" },
    { "label": "Proposal Success Rate", "previous": 18, "current": 22, "unit": "%" }
  ]
}
```

### 7.2 Historical Evaluations (optional future)
GET `/freelancer/re-evaluation/history`
200 OK:
```json
{ "evaluations": [ { "previousRanking": 60, "newRanking": 68, "improvement": 8, "createdAt": "2025-11-01T10:00:00Z" } ] }
```

---
## 8. Telemetry & Analytics (Optional Future)
(Frontend might call these; define now for backend planning.)
- POST `/telemetry/event` – generic usage events.
```json
{ "type": "compare_opened", "context": { "role": "web-developer" }, "occurredAt": "2025-11-24T10:00:00Z" }
```
Return 202 Accepted.

---
## 9. Pagination Meta Example
For list endpoints with pagination:
```json
{
  "milestones": [ ... ],
  "meta": { "page": 1, "pageSize": 20, "totalPages": 3, "totalItems": 58 }
}
```

---
## 10. Rate Limiting (Recommendation)
If enforced, include headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset` (epoch seconds)
429 body uses standard error format with `code = "RATE_LIMIT"`.

---
## 11. Security / Auth Notes
- Passwords hashed with Argon2 or bcrypt (not exposed).
- JWT expiry recommended (e.g. 1h) + refresh token flow (future: `/auth/refresh`).
- All POST/PATCH endpoints validate ownership (user cannot mutate other users' data).

---
## 12. Example Frontend Flows
### Registration → Industry Selection → Dashboard
1. `POST /auth/register` → store token.
2. `GET /industries` → show options.
3. `POST /user/industry` with `{ "industry": "Freelancer" }`.
4. `GET /freelancer/profile` (initialize defaults if new).
5. `GET /freelancer/fair-ranking`.
6. Render dashboard cards.

### Comparison Flow
1. `GET /freelancer/profile`
2. `GET /freelancer/comparison?role=web-developer` (optionally with competitorUrl).
3. Display metrics, tier, ranges.

### Insights Flow
1. `GET /freelancer/insights`.
2. Optionally `POST /freelancer/insights/regenerate` for updated list.

### Roadmap Update Flow
1. `GET /freelancer/roadmap`.
2. User toggles completion → `PATCH /freelancer/roadmap/milestones/:id { "completed": true }`.
3. Refresh progress bar.

### Re-evaluation Flow
1. `POST /freelancer/re-evaluation` with applied changes.
2. Display before/after and improvement.

---
## 13. Future Extensions (Placeholders)
| Area | Endpoint Idea | Notes |
|------|---------------|-------|
| Portfolio Items | `/freelancer/portfolio` CRUD | Detailed case studies, metrics. |
| Notifications | `/notifications` | Real-time push (WebSocket). |
| Competitor Scrape | `/freelancer/competitor/fetch` | Async job to parse external profile. |
| Refresh Token | `/auth/refresh` | Extend session securely. |
| Admin | `/admin/users` | Management & moderation. |

---
## 14. Test Data Guidelines
For development, backend may seed a default profile:
```json
{
  "profileCompleteness": 72,
  "profileViews": 120,
  "proposalSuccessRate": 18,
  "jobInvitations": 4,
  "hourlyRate": 55,
  "skills": ["React", "TypeScript", "Tailwind"],
  "portfolioItems": 8,
  "repeatClientsRate": 25
}
```

---
## 15. Performance Considerations
- Cache `/freelancer/insights` for short TTL (e.g. 5m) if AI-generated.
- Batched updates: allow sending multiple metric changes in one PATCH.
- Consider ETag / `If-None-Match` for static insights.

---
## 16. Observability
Recommended headers returned:
- `X-Request-Id` – correlation.
- `X-Processing-Time-ms` – server-side duration.
Expose health endpoint (not used by frontend UI): `GET /health` → `{ "status": "ok", "uptimeSeconds": 12345 }`.

---
## 17. Summary
This spec enumerates all immediate endpoints required by current frontend pages. Backend should implement core authenticated flows (profile, comparison, insights, roadmap, re-evaluation) first. Optional endpoints marked as future can be stubbed or omitted.

Please raise questions for any ambiguity (e.g., scoring formulas or AI generation). The frontend assumes stable contract once implemented.
