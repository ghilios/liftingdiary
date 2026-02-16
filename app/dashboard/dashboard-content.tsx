"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Workout } from "./types";

export default function DashboardContent({
  workouts,
}: {
  workouts: Workout[];
}) {
  const [date, setDate] = useState<Date>(new Date());

  const filtered = workouts.filter((w) => isSameDay(w.startedAt, date));

  return (
    <div className="flex gap-8">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(day) => day && setDate(day)}
      />

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <Button asChild>
            <Link href="/dashboard/workout/new">
              <Plus className="mr-2 h-4 w-4" />
              New Workout
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No workouts for this day.
            </p>
          ) : (
            filtered.map((workout) => (
              <Link
                key={workout.id}
                href={`/dashboard/workout/${workout.id}`}
              >
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <Dumbbell className="h-5 w-5" />
                    <CardTitle className="text-lg">
                      {workout.name ?? "Untitled Workout"}
                    </CardTitle>
                  </CardHeader>
                <CardContent>
                  {workout.workoutExercises.map((we) => (
                    <div key={we.id} className="mb-2 last:mb-0">
                      <p className="text-sm font-medium">{we.exercise.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {we.sets.length} sets
                      </p>
                    </div>
                  ))}
                  {workout.workoutExercises.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No exercises recorded.
                    </p>
                  )}
                </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
