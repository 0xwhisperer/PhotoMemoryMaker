import { 
  users, images, orders, 
  type User, type InsertUser, 
  type Image, type InsertImage,
  type Order, type InsertOrder
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface remains the same
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Image methods
  getImage(id: number): Promise<Image | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  listImages(): Promise<Image[]>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  listOrders(): Promise<Order[]>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Image methods
  async getImage(id: number): Promise<Image | undefined> {
    const results = await db.select().from(images).where(eq(images.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const result = await db.insert(images).values(insertImage).returning();
    return result[0];
  }

  async listImages(): Promise<Image[]> {
    return await db.select().from(images);
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const results = await db.select().from(orders).where(eq(orders.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }

  async listOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }
}

// Export an instance of the database storage
export const storage = new DatabaseStorage();
