export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}