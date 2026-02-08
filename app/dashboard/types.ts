import type { getWorkouts } from "@/data/workouts";

export type Workout = Awaited<ReturnType<typeof getWorkouts>>[number];
