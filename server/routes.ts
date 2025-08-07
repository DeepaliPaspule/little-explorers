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
        { id: 'fruits', name: 'Fruits', emoji: '🍎', description: 'Learn about delicious and healthy fruits' },
        { id: 'vegetables', name: 'Vegetables', emoji: '🥕', description: 'Discover nutritious vegetables' },
        { id: 'animals', name: 'Animals', emoji: '🐶', description: 'Meet amazing animals from around the world' },
        { id: 'alphabet', name: 'Alphabet', emoji: '📚', description: 'Learn letters from A to Z' },
        { id: 'colors', name: 'Colors', emoji: '🌈', description: 'Explore the vibrant world of colors' },
        { id: 'shapes', name: 'Shapes', emoji: '🔷', description: 'Discover different shapes and forms' },
        { id: 'numbers', name: 'Numbers', emoji: '🔢', description: 'Count and learn numbers 1 through 10' },
        { id: 'transportation', name: 'Transportation', emoji: '🚗', description: 'Learn about vehicles and ways to travel' }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
