import { notFound } from "next/navigation";
import { getWorkout } from "@/data/workouts";
import EditWorkoutForm from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkout(Number(workoutId));

  if (!workout) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Workout</h1>
      <EditWorkoutForm workout={workout} />
    </div>
  );
}
