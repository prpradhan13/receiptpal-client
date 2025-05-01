export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

export function cleanGeminiResponse(raw: string): string {
  let cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBracketIndex = cleaned.indexOf("[");
  if (firstBracketIndex > 0) {
    cleaned = cleaned.slice(firstBracketIndex);
  }
  return cleaned;
};

export const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
