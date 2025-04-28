import * as ImagePicker from "expo-image-picker";
import { api } from "../../convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { useAuthContext } from "../context/AuthProvider";
import { Id } from "../../convex/_generated/dataModel";

export function useUploadReceipt() {
  const { user } = useAuthContext();
  const generateUploadUrl = useMutation(api.receipts.generateUploadUrl);
  const createReceipt = useMutation(api.receipts.createReceipt);
  const extractText = useAction(api.receipts.extractTextFromImage);

  const uploadReceipt = async () => {
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

    // Fetch file binary
    const response = await fetch(asset.uri);
    const blob = await response.blob();

    // Step 1: Get upload URL
    const uploadUrl = await generateUploadUrl();

    // Step 2: Upload image
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": blob.type || "image/jpeg" },
      body: blob,
    });

    const { storageId } = await uploadResponse.json();

    const { text } = await extractText({ storageId });
    console.log("text", text);

    // Step 3: Create receipt record
    await createReceipt({
      userId: user?._id as Id<"users">,
      imageStorageId: storageId,
      extractedText: text,
      uploadedAt: Date.now(),
    });

    return storageId;
  };

  return { uploadReceipt };
}
