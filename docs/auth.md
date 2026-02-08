# Authentication

This project uses **Clerk** for all authentication. Do not use any other auth provider or roll custom auth.

## Setup

### Environment Variables

The following env vars are required in `.env`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

`NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` **must** be set. Without them, `auth.protect()` doesn't know where to redirect unauthenticated users and causes an infinite redirect loop.

### ClerkProvider

The root layout (`app/layout.tsx`) must wrap the entire app in `<ClerkProvider>`. This is already configured.

## Route Protection

### proxy.ts (not middleware.ts)

Next.js 16 uses the `proxy.ts` file convention instead of `middleware.ts`. The file lives at the project root. The code and API are identical — only the filename changed.

Protected routes are defined using `createRouteMatcher`. Only routes that match are gated behind `auth.protect()`. All other routes remain public.

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

### Rules

- Add any new authenticated routes to `isProtectedRoute` in `proxy.ts`.
- **Never** protect `/sign-in` or `/sign-up` — this causes an infinite redirect loop.
- The catch-all sign-in/sign-up pages (`app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`) use Clerk's `<SignIn />` and `<SignUp />` components. Do not build custom sign-in forms.

## Getting the Current User

### Server Components and Data Helpers

Use `auth()` from `@clerk/nextjs/server` to get the current user's ID. This is the **only** trusted source of user identity.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

- Always call `auth()` inside server-side code (Server Components, data helpers).
- Never accept a user ID from client-provided parameters — always derive it from `auth()`.
- Every database query must be scoped to the authenticated `userId`. See `/docs/data-fetching.md` for details.

### Client Components

Use Clerk's built-in components for client-side auth UI:

- `<SignedIn>` / `<SignedOut>` — conditionally render content based on auth state
- `<UserButton />` — user avatar with sign-out menu
- `<SignInButton />` / `<SignUpButton />` — trigger sign-in/sign-up flows

```tsx
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal" />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

Do not use `useAuth()` or `useUser()` for data fetching. Auth-gated data must be fetched in Server Components (see `/docs/data-fetching.md`).
