# Data Mutations

## Overview

All data mutations (create, update, delete) follow a strict pattern to ensure type safety, validation, and security.

## Rules

1. **All database writes must go through helper functions in the `/data` directory** — these wrap Drizzle ORM calls. Never call `db.insert()`, `db.update()`, or `db.delete()` directly from server actions.

2. **All mutations must be triggered via Server Actions** defined in colocated `actions.ts` files next to the page that uses them.

3. **Server Action parameters must be explicitly typed** — never use `FormData` as a parameter type.

4. **All Server Actions must validate their arguments with Zod** before passing data to the `/data` helper functions.

5. **Never use `redirect()` inside Server Actions.** Redirects must be handled client-side after the server action call completes. This keeps navigation logic in the component and avoids unexpected thrown redirect errors in the action layer.

## Directory Structure

```
app/
  dashboard/
    page.tsx          # Server Component (renders UI)
    actions.ts        # Server Actions for this route
data/
  workouts.ts         # DB helper functions (queries + mutations)
```

## Data Helper Functions (`/data`)

Helper functions in `/data` handle all direct database interaction via Drizzle ORM. They must:

- Use `auth()` from `@clerk/nextjs/server` to get the current user
- Throw an error if the user is not authenticated
- Scope all mutations to the logged-in user

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function createWorkout(data: { name: string; startedAt: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: data.name,
      startedAt: data.startedAt,
    })
    .returning();

  return workout;
}

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Server Actions (`actions.ts`)

Server Actions are the entry point for all mutations. They must:

- Be defined in a colocated `actions.ts` file with `"use server"` at the top
- Accept **typed parameters** (never `FormData`)
- Validate all input with **Zod** before calling data helpers
- Call the appropriate `/data` helper function to perform the mutation

```ts
// app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { createWorkout, deleteWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(
  params: z.infer<typeof createWorkoutSchema>
) {
  const validated = createWorkoutSchema.parse(params);
  return createWorkout(validated);
}

const deleteWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
});

export async function deleteWorkoutAction(
  params: z.infer<typeof deleteWorkoutSchema>
) {
  const validated = deleteWorkoutSchema.parse(params);
  return deleteWorkout(validated.workoutId);
}
```

## Calling Server Actions from Client Components

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

export function CreateWorkoutButton() {
  const router = useRouter();

  async function handleClick() {
    await createWorkoutAction({ name: "Push Day", startedAt: new Date() });
    router.push("/dashboard");
  }

  return <button onClick={handleClick}>Create Workout</button>;
}
```

## Summary

| Concern        | Where                  | Rule                                      |
| -------------- | ---------------------- | ----------------------------------------- |
| DB writes      | `/data/*.ts`           | Drizzle ORM only, scoped to current user  |
| Mutations      | `actions.ts` (colocated) | Server Actions with typed params        |
| Param types    | `actions.ts`           | Never use `FormData`                      |
| Validation     | `actions.ts`           | Always validate with Zod                  |
| Auth           | `/data/*.ts`           | Always call `auth()` and check `userId`   |
| Redirects      | Client Components      | Never use `redirect()` in Server Actions  |
