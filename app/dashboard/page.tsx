import { getWorkouts } from "@/data/workouts";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  const workouts = await getWorkouts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <DashboardContent workouts={workouts} />
    </div>
  );
}
