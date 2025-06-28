
/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    // Generate random index
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
