import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  userMonthlyBalance: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    month: v.number(),
  }).index("by_user_id", ["userId"]),

  receipts: defineTable({
    userId: v.id("users"),
    imageStorageId: v.id("_storage"),
    extractedText: v.string(),
    uploadedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  extracted_data: defineTable({
    receiptId: v.id("receipts"),
    userId: v.id("users"),
    category: v.string(),
    itemName: v.string(),
    quantity: v.string(),
    price: v.number(),
    total: v.number(),
    purchasedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  manual_expenses: defineTable({
    userId: v.id("users"),
    category: v.string(),
    itemName: v.string(),
    quantity: v.optional(v.string()),
    price: v.number(),
    total: v.number(),
    purchasedAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
});
