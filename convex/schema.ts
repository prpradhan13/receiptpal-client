import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  receipts: defineTable({
    userId: v.id("users"),
    imageUrl: v.optional(v.string()),
    extractedText: v.string(),
    uploadedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  extracted_data: defineTable({
    receiptId: v.id("receipts"),
    category: v.string(),
    itemName: v.string(),
    quantity: v.string(),
    price: v.number(),
    total: v.number(),
  }).index("by_receipt_id", ["receiptId"]),
});
