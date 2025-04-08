import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionTier: text("subscription_tier"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  ageRange: text("age_range").notNull(),
  gameType: text("game_type").notNull(),
  route: text("route").notNull(),
  featured: boolean("featured").default(false)
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // Duration in months
  price: integer("price").notNull(), // Price in dollars
  features: text("features").notNull(), // JSON string of features
  popular: boolean("popular").default(false)
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true
});

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// Arabic letters for educational games
export const arabicLetters = pgTable("arabic_letters", {
  id: serial("id").primaryKey(),
  letter: text("letter").notNull().unique(),
  name: text("name").notNull(),
  soundUrl: text("sound_url"),
  examples: text("examples").notNull(), // JSON string of examples
  isolated: text("isolated").notNull(),
  initial: text("initial").notNull(),
  medial: text("medial").notNull(),
  final: text("final").notNull()
});

export const insertArabicLetterSchema = createInsertSchema(arabicLetters).omit({
  id: true
});

export type InsertArabicLetter = z.infer<typeof insertArabicLetterSchema>;
export type ArabicLetter = typeof arabicLetters.$inferSelect;

// User Progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  score: integer("score").notNull().default(0),
  completedLevels: text("completed_levels").notNull(), // JSON string of completed levels
  lastPlayed: timestamp("last_played").defaultNow()
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
