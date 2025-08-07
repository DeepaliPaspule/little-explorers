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
      // Fruits - Expanded collection
      { name: 'Apple', category: 'fruits', emoji: '🍎', fact: 'CRUNCH! Apples float in water because they are 25% air! That means you could have an apple boat!' },
      { name: 'Banana', category: 'fruits', emoji: '🍌', fact: 'AMAZING! Bananas are actually berries, but strawberries are not! Bananas grow upside down too!' },
      { name: 'Orange', category: 'fruits', emoji: '🍊', fact: 'WOW! Oranges are like little vitamin C superheroes that keep you healthy and strong!' },
      { name: 'Grape', category: 'fruits', emoji: '🍇', fact: 'Grapes grow in bunches on vines!' },
      { name: 'Strawberry', category: 'fruits', emoji: '🍓', fact: 'Strawberries are the only fruit with seeds on the outside!' },
      { name: 'Watermelon', category: 'fruits', emoji: '🍉', fact: 'Watermelons are 92% water!' },
      { name: 'Pineapple', category: 'fruits', emoji: '🍍', fact: 'Pineapples take almost 3 years to grow!' },
      { name: 'Peach', category: 'fruits', emoji: '🍑', fact: 'Peaches are fuzzy to protect themselves from insects!' },
      { name: 'Lemon', category: 'fruits', emoji: '🍋', fact: 'Lemons have more sugar than strawberries!' },
      { name: 'Cherry', category: 'fruits', emoji: '🍒', fact: 'Cherries are one of the first fruits to ripen in spring!' },
      { name: 'Mango', category: 'fruits', emoji: '🥭', fact: 'Mangoes are the most popular fruit in the world!' },
      { name: 'Coconut', category: 'fruits', emoji: '🥥', fact: 'Coconuts can float across oceans!' },
      { name: 'Kiwi', category: 'fruits', emoji: '🥝', fact: 'Kiwis have more vitamin C than oranges!' },
      { name: 'Avocado', category: 'fruits', emoji: '🥑', fact: 'Avocados are technically berries with one giant seed!' },
      
      // Vegetables - Expanded collection
      { name: 'Carrot', category: 'vegetables', emoji: '🥕', fact: 'Carrots help your eyes see better in the dark!' },
      { name: 'Broccoli', category: 'vegetables', emoji: '🥦', fact: 'Broccoli looks like tiny trees!' },
      { name: 'Tomato', category: 'vegetables', emoji: '🍅', fact: 'Tomatoes are actually fruits, not vegetables!' },
      { name: 'Corn', category: 'vegetables', emoji: '🌽', fact: 'Each ear of corn has about 800 kernels!' },
      { name: 'Pepper', category: 'vegetables', emoji: '🫑', fact: 'Bell peppers can be red, yellow, green, or purple!' },
      { name: 'Potato', category: 'vegetables', emoji: '🥔', fact: 'Potatoes were the first vegetable grown in space!' },
      { name: 'Onion', category: 'vegetables', emoji: '🧅', fact: 'Onions make you cry because they release gas when cut!' },
      { name: 'Lettuce', category: 'vegetables', emoji: '🥬', fact: 'Lettuce is 95% water!' },
      { name: 'Cucumber', category: 'vegetables', emoji: '🥒', fact: 'Cucumbers are 96% water and very refreshing!' },
      { name: 'Peas', category: 'vegetables', emoji: '🟢', fact: 'Peas are one of the oldest vegetables known to humans!' },
      { name: 'Celery', category: 'vegetables', emoji: '🥬', fact: 'Celery takes more calories to eat than it contains!' },
      { name: 'Spinach', category: 'vegetables', emoji: '🥬', fact: 'Spinach is packed with iron to make you strong!' },
      { name: 'Mushroom', category: 'vegetables', emoji: '🍄', fact: 'Mushrooms are not plants - they are fungi!' },
      { name: 'Eggplant', category: 'vegetables', emoji: '🍆', fact: 'Eggplants used to be white and shaped like eggs!' },
      
      // Animals - Expanded collection
      { name: 'Dog', category: 'animals', emoji: '🐶', fact: 'WOOF! Dogs have super noses that can smell 10,000 times better than humans! They are like furry detectives!' },
      { name: 'Cat', category: 'animals', emoji: '🐱', fact: 'MEOW! Cats are chatterboxes who can make over 100 different sounds! They purr when happy!' },
      { name: 'Elephant', category: 'animals', emoji: '🐘', fact: 'TRUMPET! Elephants are gentle giants - the biggest land animals who never forget their friends!' },
      { name: 'Bird', category: 'animals', emoji: '🐦', fact: 'Birds are the only animals with feathers!' },
      { name: 'Fish', category: 'animals', emoji: '🐠', fact: 'Fish breathe underwater using gills instead of lungs!' },
      { name: 'Lion', category: 'animals', emoji: '🦁', fact: 'Lions live in groups called prides!' },
      { name: 'Tiger', category: 'animals', emoji: '🐅', fact: 'Every tiger has unique stripes, like human fingerprints!' },
      { name: 'Bear', category: 'animals', emoji: '🐻', fact: 'Bears can run as fast as horses!' },
      { name: 'Rabbit', category: 'animals', emoji: '🐰', fact: 'Rabbits can see almost 360 degrees around them!' },
      { name: 'Turtle', category: 'animals', emoji: '🐢', fact: 'Some turtles can live for over 100 years!' },
      { name: 'Butterfly', category: 'animals', emoji: '🦋', fact: 'Butterflies taste with their feet!' },
      { name: 'Frog', category: 'animals', emoji: '🐸', fact: 'Frogs drink water through their skin!' },
      { name: 'Penguin', category: 'animals', emoji: '🐧', fact: 'Penguins slide on their bellies to move faster on ice!' },
      { name: 'Monkey', category: 'animals', emoji: '🐒', fact: 'Monkeys can use tools and are very smart!' },
      { name: 'Horse', category: 'animals', emoji: '🐴', fact: 'Horses can sleep both lying down and standing up!' },
      { name: 'Cow', category: 'animals', emoji: '🐄', fact: 'Cows have best friends and get sad when separated!' },
      
      // Complete Alphabet A-Z
      { name: 'A', category: 'alphabet', emoji: '🍎', fact: 'A is for Apple! The first letter of the alphabet.' },
      { name: 'B', category: 'alphabet', emoji: '🐻', fact: 'B is for Bear! Bears love to eat honey.' },
      { name: 'C', category: 'alphabet', emoji: '🐱', fact: 'C is for Cat! Cats are great pets.' },
      { name: 'D', category: 'alphabet', emoji: '🐶', fact: 'D is for Dog! Dogs are loyal friends.' },
      { name: 'E', category: 'alphabet', emoji: '🐘', fact: 'E is for Elephant! Elephants never forget.' },
      { name: 'F', category: 'alphabet', emoji: '🐸', fact: 'F is for Frog! Frogs can jump very high!' },
      { name: 'G', category: 'alphabet', emoji: '🍇', fact: 'G is for Grape! Grapes grow in bunches.' },
      { name: 'H', category: 'alphabet', emoji: '🐴', fact: 'H is for Horse! Horses gallop very fast.' },
      { name: 'I', category: 'alphabet', emoji: '🍦', fact: 'I is for Ice cream! A delicious frozen treat.' },
      { name: 'J', category: 'alphabet', emoji: '🤹', fact: 'J is for Juggle! Juggling takes lots of practice.' },
      { name: 'K', category: 'alphabet', emoji: '🥝', fact: 'K is for Kiwi! A fuzzy fruit from New Zealand.' },
      { name: 'L', category: 'alphabet', emoji: '🦁', fact: 'L is for Lion! The king of the jungle.' },
      { name: 'M', category: 'alphabet', emoji: '🐒', fact: 'M is for Monkey! Monkeys love to swing from trees.' },
      { name: 'N', category: 'alphabet', emoji: '🥜', fact: 'N is for Nut! Nuts are healthy snacks.' },
      { name: 'O', category: 'alphabet', emoji: '🍊', fact: 'O is for Orange! Oranges are round and juicy.' },
      { name: 'P', category: 'alphabet', emoji: '🐧', fact: 'P is for Penguin! Penguins waddle on ice.' },
      { name: 'Q', category: 'alphabet', emoji: '👑', fact: 'Q is for Queen! Queens wear beautiful crowns.' },
      { name: 'R', category: 'alphabet', emoji: '🐰', fact: 'R is for Rabbit! Rabbits hop very quickly.' },
      { name: 'S', category: 'alphabet', emoji: '☀️', fact: 'S is for Sun! The sun gives us light and warmth.' },
      { name: 'T', category: 'alphabet', emoji: '🐅', fact: 'T is for Tiger! Tigers have beautiful stripes.' },
      { name: 'U', category: 'alphabet', emoji: '☂️', fact: 'U is for Umbrella! Umbrellas keep us dry in rain.' },
      { name: 'V', category: 'alphabet', emoji: '🌋', fact: 'V is for Volcano! Volcanoes are mountains that erupt.' },
      { name: 'W', category: 'alphabet', emoji: '🍉', fact: 'W is for Watermelon! Watermelons are mostly water.' },
      { name: 'X', category: 'alphabet', emoji: '🎄', fact: 'X is for Xmas tree! Christmas trees are decorated with lights.' },
      { name: 'Y', category: 'alphabet', emoji: '🧶', fact: 'Y is for Yarn! Yarn is used to knit warm clothes.' },
      { name: 'Z', category: 'alphabet', emoji: '🦓', fact: 'Z is for Zebra! Zebras have black and white stripes.' },

      // New Categories
      
      // Colors
      { name: 'Red', category: 'colors', emoji: '🔴', fact: 'Red is the color of fire trucks and strawberries!' },
      { name: 'Blue', category: 'colors', emoji: '🔵', fact: 'Blue is the color of the sky and ocean!' },
      { name: 'Yellow', category: 'colors', emoji: '🟡', fact: 'Yellow is the color of the sun and bananas!' },
      { name: 'Green', category: 'colors', emoji: '🟢', fact: 'Green is the color of grass and leaves!' },
      { name: 'Orange', category: 'colors', emoji: '🟠', fact: 'Orange is the color of carrots and pumpkins!' },
      { name: 'Purple', category: 'colors', emoji: '🟣', fact: 'Purple is the color of grapes and violets!' },
      { name: 'Pink', category: 'colors', emoji: '🩷', fact: 'Pink is the color of flamingos and cotton candy!' },
      { name: 'Black', category: 'colors', emoji: '⚫', fact: 'Black is the color of night and ravens!' },
      { name: 'White', category: 'colors', emoji: '⚪', fact: 'White is the color of snow and clouds!' },
      { name: 'Brown', category: 'colors', emoji: '🤎', fact: 'Brown is the color of tree bark and chocolate!' },

      // Shapes
      { name: 'Circle', category: 'shapes', emoji: '⭕', fact: 'A circle is perfectly round, like a ball!' },
      { name: 'Square', category: 'shapes', emoji: '🟦', fact: 'A square has four equal sides!' },
      { name: 'Triangle', category: 'shapes', emoji: '🔺', fact: 'A triangle has three sides and three corners!' },
      { name: 'Rectangle', category: 'shapes', emoji: '▭', fact: 'A rectangle is like a square but longer!' },
      { name: 'Star', category: 'shapes', emoji: '⭐', fact: 'Stars have points that stick out!' },
      { name: 'Heart', category: 'shapes', emoji: '❤️', fact: 'Hearts are the shape of love!' },
      { name: 'Diamond', category: 'shapes', emoji: '💎', fact: 'Diamonds are sparkly and precious!' },
      { name: 'Oval', category: 'shapes', emoji: '🥚', fact: 'An oval is like a stretched circle, like an egg!' },

      // Numbers 1-10
      { name: 'One', category: 'numbers', emoji: '1️⃣', fact: 'One is the first counting number!' },
      { name: 'Two', category: 'numbers', emoji: '2️⃣', fact: 'Two is a pair, like your two hands!' },
      { name: 'Three', category: 'numbers', emoji: '3️⃣', fact: 'Three wheels make a tricycle!' },
      { name: 'Four', category: 'numbers', emoji: '4️⃣', fact: 'Four legs on a table keep it steady!' },
      { name: 'Five', category: 'numbers', emoji: '5️⃣', fact: 'Five fingers on each hand!' },
      { name: 'Six', category: 'numbers', emoji: '6️⃣', fact: 'Six sides on a snowflake!' },
      { name: 'Seven', category: 'numbers', emoji: '7️⃣', fact: 'Seven days in a week!' },
      { name: 'Eight', category: 'numbers', emoji: '8️⃣', fact: 'Eight legs on a spider!' },
      { name: 'Nine', category: 'numbers', emoji: '9️⃣', fact: 'Nine lives for a cat!' },
      { name: 'Ten', category: 'numbers', emoji: '🔟', fact: 'Ten fingers on your hands!' },

      // Transportation
      { name: 'Car', category: 'transportation', emoji: '🚗', fact: 'Cars have four wheels and drive on roads!' },
      { name: 'Bus', category: 'transportation', emoji: '🚌', fact: 'Buses carry many people to school and work!' },
      { name: 'Train', category: 'transportation', emoji: '🚂', fact: 'Trains travel on railroad tracks!' },
      { name: 'Airplane', category: 'transportation', emoji: '✈️', fact: 'Airplanes fly high in the sky!' },
      { name: 'Boat', category: 'transportation', emoji: '🛥️', fact: 'Boats float on water!' },
      { name: 'Bicycle', category: 'transportation', emoji: '🚲', fact: 'Bicycles have two wheels and you pedal them!' },
      { name: 'Motorcycle', category: 'transportation', emoji: '🏍️', fact: 'Motorcycles are like bicycles with engines!' },
      { name: 'Truck', category: 'transportation', emoji: '🚚', fact: 'Trucks carry heavy things!' },
      { name: 'Helicopter', category: 'transportation', emoji: '🚁', fact: 'Helicopters have spinning blades on top!' },
      { name: 'Rocket', category: 'transportation', emoji: '🚀', fact: 'Rockets blast off into space!' },
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
