import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", args);
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const userData = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    
      if (!userData) {
        console.error("User not found!");
        return;
      };

    return userData;
  }
});

export const getUserMonthlyBalance = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, { userId }) => {
    const userBalance = await ctx.db
      .query("userMonthlyBalance")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
      if (!userBalance) {
        console.error("User not found!");
        return;
      };

    return userBalance;
  }
})
