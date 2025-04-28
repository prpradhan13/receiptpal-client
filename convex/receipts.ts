import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import Tesseract from "tesseract.js";
import { arrayBufferToBase64 } from "../src/utils/helpingFunc"

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

    const ocrFetch = await fetch("https://c9d7-106-215-149-87.ngrok-free.app/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imageUrl: base64 })
    });
    
    const extractText = await ocrFetch.json();    
    if (!extractText?.text) {
      throw new Error(`OCR failed: ${extractText.error || "Unknown error"}`);
    }

    return { text: extractText?.text?.trim() };
  },
});