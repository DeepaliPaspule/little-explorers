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
        { id: 'fruits', name: 'Fruits', emoji: '🍎', description: 'Learn about delicious fruits like apples, bananas, and oranges' },
        { id: 'vegetables', name: 'Vegetables', emoji: '🥕', description: 'Discover healthy vegetables like carrots, broccoli, and tomatoes' },
        { id: 'animals', name: 'Animals', emoji: '🐶', description: 'Meet amazing animals like dogs, cats, elephants, and birds' },
        { id: 'alphabet', name: 'Alphabet', emoji: '🔤', description: 'Learn the alphabet from A to Z with fun examples' }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
