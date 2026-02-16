"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  params: z.infer<typeof updateWorkoutSchema>
) {
  const validated = updateWorkoutSchema.parse(params);
  return updateWorkout(validated.id, {
    name: validated.name,
    startedAt: validated.startedAt,
  });
}
