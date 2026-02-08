"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mb-6 w-64 justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "do MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => day && setDate(day)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <h2 className="mb-4 text-xl font-semibold">
        Workouts for {format(date, "do MMM yyyy")}
      </h2>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts for this day.
          </p>
        ) : (
          filtered.map((workout) => (
            <Card key={workout.id}>
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
          ))
        )}
      </div>
    </>
  );
}
