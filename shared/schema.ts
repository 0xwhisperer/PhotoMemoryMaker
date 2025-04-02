import { pgTable, text, serial, integer, boolean, json, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// Define image schema and types
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeMb: numeric("size_mb").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
});

export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

// Define order schema and types
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  imageId: integer("image_id").notNull(),
  productType: text("product_type").notNull(), // 'postcard' or 'poster'
  productSize: text("product_size").notNull(), // 'small', 'medium', 'large'
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price").notNull(),
  totalPrice: numeric("total_price").notNull(),
  rotation: integer("rotation").notNull(),
  filter: text("filter").notNull(),
  customerInfo: json("customer_info").notNull(), // JSON with shipping and payment info
  orderedAt: text("ordered_at").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Define product pricing schema
export const productPricingSchema = z.object({
  postcard: z.object({
    small: z.number(),
    medium: z.number(),
    large: z.number(),
  }),
  poster: z.object({
    small: z.number(),
    medium: z.number(),
    large: z.number(),
  }),
});

export type ProductPricing = z.infer<typeof productPricingSchema>;
