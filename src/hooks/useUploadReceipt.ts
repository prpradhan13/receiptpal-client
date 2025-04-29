import * as ImagePicker from "expo-image-picker";
import { api } from "../../convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { useAuthContext } from "../context/AuthProvider";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

export function useUploadReceipt() {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthContext();
  const generateUploadUrl = useMutation(api.receipts.generateUploadUrl);
  const createReceipt = useMutation(api.receipts.createReceipt);
  const extractText = useAction(api.receipts.extractTextFromImage);
  const generateReceiptDetails = useAction(api.receipts.generateReceiptDetails);
  const saveExtractedData = useMutation(api.receipts.saveExtractedData);

  const uploadReceipt = async () => {
    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.assets || result.assets.length === 0) {
        throw new Error("No image selected.");
      }

      const asset = result.assets[0];

      if (!asset.uri) throw new Error("No asset URI");

      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const uploadUrl = await generateUploadUrl();

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type || "image/jpeg" },
        body: blob,
      });

      const { storageId } = await uploadResponse.json();

      const { text } = await extractText({ storageId });

      const receiptId = await createReceipt({
        userId: user?._id as Id<"users">,
        imageStorageId: storageId,
        extractedText: text,
        uploadedAt: Date.now(),
      });

      const { items } = await generateReceiptDetails({ extractedText: text });
      await saveExtractedData({ receiptId, items });

      return storageId;
    } catch (error) {
      console.error("Upload Receipt Failed!", error)
      alert("Something went wrong in upload receipt." + error)
    } finally {
      setIsUploading(false)
    }
  };

  return { uploadReceipt, isUploading };
}
