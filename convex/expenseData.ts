import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUsersAllExpenses = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, { userId }) => {
        if (!userId) throw new Error("User id required!");
        
        const receiptExpeses = await ctx.db
            .query("extracted_data")
            .withIndex(
                'by_user_id',
                (q) => q.eq("userId", userId)
            )
            .collect();

        if (!receiptExpeses) throw new Error("Receipt Expenses can not find!");

        return receiptExpeses;
    }
})