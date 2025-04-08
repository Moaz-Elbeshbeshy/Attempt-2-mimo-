import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table - keeping it as a reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Arabic Letters schema
export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  char: text("char").notNull(),
  name: text("name").notNull(),
  translit: text("translit").notNull(),
  isolated: text("isolated").notNull(),
  initial: text("initial").notNull(),
  medial: text("medial").notNull(),
  final: text("final").notNull(),
  type: text("type").notNull(), // abjadi, hijai, or manquta (with dots)
  audioPath: text("audio_path").notNull(),
});

export const insertLetterSchema = createInsertSchema(letters).omit({
  id: true,
});

export type InsertLetter = z.infer<typeof insertLetterSchema>;
export type Letter = typeof letters.$inferSelect;

// Letter examples schema
export const letterExamples = pgTable("letter_examples", {
  id: serial("id").primaryKey(),
  letterId: integer("letter_id").notNull(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
});

export const insertLetterExampleSchema = createInsertSchema(letterExamples).omit({
  id: true,
});

export type InsertLetterExample = z.infer<typeof insertLetterExampleSchema>;
export type LetterExample = typeof letterExamples.$inferSelect;
