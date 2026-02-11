import NewWorkoutForm from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Create Workout</h1>
      <NewWorkoutForm />
    </div>
  );
}
