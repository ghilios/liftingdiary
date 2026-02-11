import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

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

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    orderBy: desc(workouts.startedAt),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => asc(we.order),
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => asc(s.setNumber),
          },
        },
      },
    },
  });
}
