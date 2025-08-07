import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const learningItems = pgTable("learning_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  emoji: text("emoji").notNull(),
  fact: text("fact").notNull(),
});

export const insertLearningItemSchema = createInsertSchema(learningItems).pick({
  name: true,
  category: true,
  emoji: true,
  fact: true,
});

export type InsertLearningItem = z.infer<typeof insertLearningItemSchema>;
export type LearningItem = typeof learningItems.$inferSelect;

// Category type for frontend use
export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};
