# Data Fetching

## Core Rules

1. **ALL data fetching MUST be done in Server Components.** Never fetch data in Client Components or Route Handlers.
2. **ALL database queries MUST go through helper functions in the `/data` directory.** No inline queries.
3. **ALL helper functions MUST use Drizzle ORM.** Never use raw SQL.
4. **ALL queries MUST be scoped to the logged-in user.** A user must never be able to access another user's data.

## Server Components Only

Data fetching happens exclusively in Server Components. This means:

- No `fetch()` calls in Client Components
- No Route Handlers (`app/api/`) for data fetching
- No `useEffect` + fetch patterns
- No client-side data fetching libraries (React Query, SWR, etc.)

```tsx
// CORRECT - Server Component fetching data
import { getWorkouts } from "@/data/workouts";

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  return <WorkoutList workouts={workouts} />;
}
```

```tsx
// WRONG - Client Component fetching data
"use client";
import { useEffect, useState } from "react";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  useEffect(() => {
    fetch("/api/workouts").then((res) => res.json()).then(setWorkouts);
  }, []);
  // ...
}
```

## Data Helper Functions (`/data` directory)

All database access is encapsulated in helper functions within `/data`. Each helper function:

- Uses Drizzle ORM (never raw SQL)
- Authenticates the user and scopes queries to their data
- Returns typed results

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## User Data Isolation

This is critical. Every single query must be filtered by the authenticated user's ID. No exceptions.

- Always call `auth()` to get the current user
- Always include a `where` clause filtering by `userId`
- Never expose endpoints or functions that accept an arbitrary user ID from the client
- Never trust client-provided user IDs — always derive the user ID from the server-side auth session

```ts
// CORRECT - userId comes from auth session
export async function getWorkout(workoutId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

```ts
// WRONG - userId comes from a parameter (could be spoofed)
export async function getWorkout(workoutId: string, userId: string) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```
