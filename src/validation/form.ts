import { z } from "zod";

export const createExpenseSchema = z.object({
    category: z.string().min(1, "Choose one").trim(),
    itemName: z.string().min(3, "Name atleast 3 characters").trim(),
    quantity: z.string().trim().optional(),
    price: z.number().min(1, "Price atleast 1"),
    purchasedAt: z.string(),
    notes: z.string().trim().optional()
})

export type TCreateExpenseSchema = z.infer<typeof createExpenseSchema>;