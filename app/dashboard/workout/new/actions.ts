"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

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
