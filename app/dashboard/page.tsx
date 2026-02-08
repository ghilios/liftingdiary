"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_WORKOUTS = [
  { id: "1", name: "Bench Press", sets: 4, reps: 8 },
  { id: "2", name: "Squat", sets: 5, reps: 5 },
  { id: "3", name: "Deadlift", sets: 3, reps: 5 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

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
        {MOCK_WORKOUTS.map((workout) => (
          <Card key={workout.id}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Dumbbell className="h-5 w-5" />
              <CardTitle className="text-lg">{workout.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {workout.sets} sets x {workout.reps} reps
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
