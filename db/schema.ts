import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  workoutExerciseId: integer("workout_exercise_id").notNull().references(() => workoutExercises.id, { onDelete: "cascade" }),
  weight: real("weight"),
  reps: integer("reps").notNull(),
  setNumber: integer("set_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Drizzle relations for type-safe queries
export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, { fields: [workoutExercises.workoutId], references: [workouts.id] }),
  exercise: one(exercises, { fields: [workoutExercises.exerciseId], references: [exercises.id] }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, { fields: [sets.workoutExerciseId], references: [workoutExercises.id] }),
}));
