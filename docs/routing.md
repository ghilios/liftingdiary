# Routing

This project uses the **Next.js App Router** with all application routes nested under `/dashboard`.

## Route Structure

```
app/
  page.tsx                              # Public landing page (/)
  sign-in/[[...sign-in]]/page.tsx       # Public sign-in page
  sign-up/[[...sign-up]]/page.tsx       # Public sign-up page
  dashboard/
    page.tsx                            # /dashboard (protected)
    workout/
      new/page.tsx                      # /dashboard/workout/new (protected)
      [workoutId]/page.tsx              # /dashboard/workout/:id (protected)
```

## Rules

### All app routes live under `/dashboard`

Every authenticated feature page must be a child of `app/dashboard/`. Never create top-level routes for app features. The only top-level routes allowed are:

- `/` — public landing page
- `/sign-in` — Clerk sign-in (public, never protect)
- `/sign-up` — Clerk sign-up (public, never protect)

### All `/dashboard` routes are protected

Route protection is handled by **Clerk middleware** in `proxy.ts` (Next.js 16 convention) using the `/dashboard(.*)` matcher. This means every route under `/dashboard` is automatically protected — no per-page auth checks needed.

```ts
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
```

See `/docs/auth.md` for the full middleware setup and auth details.

### Adding new routes

When adding a new feature route:

1. Create it inside `app/dashboard/` (e.g., `app/dashboard/exercises/page.tsx`).
2. It will automatically be protected by the existing middleware matcher — no changes to `proxy.ts` required.
3. Use Server Components by default. Only add `"use client"` when the component needs interactivity.

### Dynamic routes

Use Next.js dynamic segments for resource-specific pages:

```
app/dashboard/workout/[workoutId]/page.tsx   # /dashboard/workout/123
```

Access params via the `params` prop in the page component.

### Never protect public routes

`/sign-in` and `/sign-up` must remain public. Protecting them causes an infinite redirect loop. See `/docs/auth.md` for details.
