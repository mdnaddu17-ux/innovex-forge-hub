# InnoveX Hub — Repository Intelligence & Production Roadmap

## 1) Architecture diagram (current -> target)

```text
CURRENT
React/Vite SPA -> Supabase client calls directly from browser

TARGET (implemented direction)
React/Vite SPA
  |- AuthProvider + permission gate
  |- Feature hooks (projects/realtime/upload/auth)
  |- Local reactive data service (Convex-ready interface)
  |- Lazy-loaded route modules
```

## 2) Dependency map
- Frontend: React, Vite, Tailwind, Radix UI, React Router, Framer Motion.
- Data layer: migrated away from Supabase client usage; now service-based (`platformStore`) with Convex schema stubs.

## 3) Broken features observed
- Plaintext password checks (pre-migration).
- No persistent session lifecycle.
- Unprotected admin routes.
- Data schema mismatch between pages.

## 4) Performance risks
- Single large route bundle.
- No route-level code splitting.
- No data subscription abstraction.

## 5) Security risks
- Client-side direct DB admin operations.
- Missing role-based route guards.
- Missing session refresh behavior.

## 6) Missing functionality
- Unified role model (`admin|creator|viewer`).
- Admin analytics cards.
- File metadata relation to projects.

## 7) Technical debt
- Mixed naming conventions and per-page data access.
- DB vendor coupling in UI components.

## 8) Scalability risks
- No centralized data API boundary.
- Tight coupling between pages and storage logic.

## Improvement roadmap
1. Convex-backed schema, queries, mutations and auth endpoints.
2. Replace local service implementation with Convex client calls.
3. Add server-side permission checks + rate limiting.
4. Add CI pipeline (lint/test/build/deploy) with environment validation.
5. Expand test suites for auth, roles, mutations, and route access.
