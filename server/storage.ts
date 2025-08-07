import { type LearningItem, type InsertLearningItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getLearningItems(): Promise<LearningItem[]>;
  getLearningItemsByCategory(category: string): Promise<LearningItem[]>;
  createLearningItem(item: InsertLearningItem): Promise<LearningItem>;
}

export class MemStorage implements IStorage {
  private items: Map<string, LearningItem>;

  constructor() {
    this.items = new Map();
    this.seedData();
  }

  private seedData() {
    const learningData = [
      // Fruits
      { name: 'Apple', category: 'fruits', emoji: '🍎', fact: 'Apples float in water because they are 25% air!' },
      { name: 'Banana', category: 'fruits', emoji: '🍌', fact: 'Bananas are berries, but strawberries are not!' },
      { name: 'Orange', category: 'fruits', emoji: '🍊', fact: 'Oranges are full of vitamin C which keeps you healthy!' },
      { name: 'Grape', category: 'fruits', emoji: '🍇', fact: 'Grapes grow in bunches on vines!' },
      { name: 'Strawberry', category: 'fruits', emoji: '🍓', fact: 'Strawberries are the only fruit with seeds on the outside!' },
      { name: 'Watermelon', category: 'fruits', emoji: '🍉', fact: 'Watermelons are 92% water!' },
      
      // Vegetables
      { name: 'Carrot', category: 'vegetables', emoji: '🥕', fact: 'Carrots help your eyes see better in the dark!' },
      { name: 'Broccoli', category: 'vegetables', emoji: '🥦', fact: 'Broccoli looks like tiny trees!' },
      { name: 'Tomato', category: 'vegetables', emoji: '🍅', fact: 'Tomatoes are actually fruits, not vegetables!' },
      { name: 'Corn', category: 'vegetables', emoji: '🌽', fact: 'Each ear of corn has about 800 kernels!' },
      { name: 'Pepper', category: 'vegetables', emoji: '🫑', fact: 'Bell peppers can be red, yellow, green, or purple!' },
      { name: 'Potato', category: 'vegetables', emoji: '🥔', fact: 'Potatoes were the first vegetable grown in space!' },
      
      // Animals
      { name: 'Dog', category: 'animals', emoji: '🐶', fact: 'Dogs have an amazing sense of smell, much better than humans!' },
      { name: 'Cat', category: 'animals', emoji: '🐱', fact: 'Cats can make over 100 different sounds!' },
      { name: 'Elephant', category: 'animals', emoji: '🐘', fact: 'Elephants are the largest animals that live on land!' },
      { name: 'Bird', category: 'animals', emoji: '🐦', fact: 'Birds are the only animals with feathers!' },
      { name: 'Fish', category: 'animals', emoji: '🐠', fact: 'Fish breathe underwater using gills instead of lungs!' },
      { name: 'Lion', category: 'animals', emoji: '🦁', fact: 'Lions live in groups called prides!' },
      
      // Alphabet
      { name: 'A', category: 'alphabet', emoji: '🍎', fact: 'A is for Apple! The first letter of the alphabet.' },
      { name: 'B', category: 'alphabet', emoji: '🐻', fact: 'B is for Bear! Bears love to eat honey.' },
      { name: 'C', category: 'alphabet', emoji: '🐱', fact: 'C is for Cat! Cats are great pets.' },
      { name: 'D', category: 'alphabet', emoji: '🐶', fact: 'D is for Dog! Dogs are loyal friends.' },
      { name: 'E', category: 'alphabet', emoji: '🐘', fact: 'E is for Elephant! Elephants never forget.' },
      { name: 'F', category: 'alphabet', emoji: '🐸', fact: 'F is for Frog! Frogs can jump very high!' },
    ];

    learningData.forEach(item => {
      const id = randomUUID();
      const learningItem: LearningItem = { ...item, id };
      this.items.set(id, learningItem);
    });
  }

  async getLearningItems(): Promise<LearningItem[]> {
    return Array.from(this.items.values());
  }

  async getLearningItemsByCategory(category: string): Promise<LearningItem[]> {
    return Array.from(this.items.values()).filter(item => item.category === category);
  }

  async createLearningItem(insertItem: InsertLearningItem): Promise<LearningItem> {
    const id = randomUUID();
    const item: LearningItem = { ...insertItem, id };
    this.items.set(id, item);
    return item;
  }
}

export const storage = new MemStorage();
