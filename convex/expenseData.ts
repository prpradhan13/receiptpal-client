import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUsersAllExpenses = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) throw new Error("User id required!");

    const receiptExpeses = await ctx.db
      .query("extracted_data")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    if (!receiptExpeses) throw new Error("Receipt Expenses can not find!");

    return receiptExpeses;
  },
});

export const createExpense = mutation({
  args: {
    userId: v.id("users"),
    category: v.string(),
    itemName: v.string(),
    quantity: v.optional(v.string()),
    price: v.number(),
    total: v.number(),
    purchasedAt: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("manual_expenses", {
      userId: args.userId,
      category: args.category,
      itemName: args.itemName,
      quantity: args.quantity,
      price: args.price,
      total: args.total,
      purchasedAt: args.purchasedAt,
      notes: args.notes,
    });
  },
});
