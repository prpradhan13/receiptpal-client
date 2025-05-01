import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import {
  arrayBufferToBase64,
  cleanGeminiResponse,
} from "../src/utils/helpingFunc";
import { categorizeExtractedText } from "../src/constants/Prompt"

export const createReceipt = mutation({
  args: {
    userId: v.id("users"),
    imageStorageId: v.id("_storage"),
    extractedText: v.string(),
    uploadedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("receipts", args);
  },
});

// To generate a URL for uploading
export const generateUploadUrl = mutation(async ({ storage }) => {
  return await storage.generateUploadUrl();
});

export const extractTextFromImage = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    const imageUrl = await ctx.storage.getUrl(storageId);

    if (!imageUrl) {
      throw new Error("Image URL could not be generated.");
    }

    // Fetch image yourself
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    const ocrFetch = await fetch(
      "https://4151-2401-4900-8fd2-2cfd-9483-cbb2-dd93-28ea.ngrok-free.app/ocr",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: base64 }),
      }
    );

    const extractText = await ocrFetch.json();

    if (!extractText) {
      throw new Error(`OCR failed: ${extractText.error || "Unknown error"}`);
    }

    return { text: extractText.text.trim() };
  },
});

export const generateReceiptDetails = action({
  args: {
    extractedText: v.string(),
  },
  handler: async (ctx, { extractedText }) => {
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${categorizeExtractedText} ${extractedText}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const json = await response.json();
    if (!json.candidates || json.candidates.length === 0) {
      throw new Error("Gemini response invalid or empty.");
    }

    const content = cleanGeminiResponse(
      json.candidates[0].content.parts[0].text
    );

    const items = JSON.parse(content);

    return { items };
  },
});

export const saveExtractedData = mutation({
  args: {
    receiptId: v.id("receipts"),
    userId: v.id("users"),
    items: v.array(
      v.object({
        itemName: v.string(),
        quantity: v.union(v.string(), v.null()),
        price: v.number(),
        total: v.number(),
        category: v.union(v.string(), v.null()),
      })
    ),
    purchasedAt: v.number(),
  },
  handler: async (ctx, { receiptId, userId, items, purchasedAt }) => {
    for (const item of items) {
      if (item.price === 0) continue;

      await ctx.db.insert("extracted_data", {
        receiptId,
        userId,
        itemName: item.itemName,
        quantity: item.quantity ?? "no quantity",
        price: item.price,
        total: item.total,
        category: item.category ?? "others",
        purchasedAt,
      });
    }
    return { success: true };
  },
});

// 1745940419756.0388