export function colorFromString(str: string | undefined) {
  if (!str) {
    return {
      backgroundColor: "hsl(0, 0%, 90%)",
      borderColor: "hsl(0, 0%, 70%)",
    };
  }

  // Stronger hashing (FNV-1a 32-bit)
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }

  // Spread hue more aggressively
  const hue = (hash % 360 + (hash >>> 8) % 180) % 360;

  const s = 65; 
  const l = 80;

  return {
    backgroundColor: `hsl(${hue}, ${s}%, ${l}%)`,
    borderColor: `hsl(${hue}, ${s + 10}%, ${l - 20}%)`,
  };
}
