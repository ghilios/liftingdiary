"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createWorkoutAction } from "./actions";

export default function NewWorkoutForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await createWorkoutAction({ name, startedAt: date });
      router.push("/dashboard");
    } catch {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workout Name</Label>
            <Input
              id="name"
              placeholder="e.g. Push Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-start"
                >
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
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create Workout"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
