# Migration Notes

- Removed Supabase client integration and bucket setup scripts.
- Introduced `platformStore` service as the backend boundary with auth/session/project/goal/file operations.
- Added Convex-ready schema/queries/mutations reference files under `convex/`.
- Added route guards and lazy loading for admin and creator workflows.

## Security report
- Added role-based route protection (`admin`, `creator`, `viewer`, `guest`).
- Added session persistence + rolling refresh + expiry handling.
- Added file validation constraints (type + max size).

## Performance report
- Added route-level lazy loading for all pages.
- Added reactive subscription hooks for near real-time UI updates.
- Reduced initial bundle by moving routes into split chunks.
