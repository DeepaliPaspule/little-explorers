import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all learning items
  app.get("/api/learning-items", async (req, res) => {
    try {
      const items = await storage.getLearningItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning items" });
    }
  });

  // Get learning items by category
  app.get("/api/learning-items/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getLearningItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning items for category" });
    }
  });

  // Get available categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = [
        { id: 'fruits', name: 'Fruits', emoji: '🍎', description: 'Yummy fruits to discover and taste' },
        { id: 'vegetables', name: 'Vegetables', emoji: '🥕', description: 'Healthy veggies that help you grow strong' },
        { id: 'animals', name: 'Animals', emoji: '🐶', description: 'Amazing creatures from around the world' },
        { id: 'alphabet', name: 'Alphabet', emoji: '📚', description: 'Letters from A to Z with fun examples' },
        { id: 'colors', name: 'Colors', emoji: '🌈', description: 'Beautiful colors all around us' },
        { id: 'shapes', name: 'Shapes', emoji: '🔷', description: 'Cool shapes you see every day' },
        { id: 'numbers', name: 'Numbers', emoji: '🔢', description: 'Counting from 1 to 10 with surprises' },
        { id: 'transportation', name: 'Transportation', emoji: '🚗', description: 'Vehicles that take us on adventures' }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
