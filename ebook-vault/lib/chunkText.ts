export interface Chunk {
  id: number;
  text: string;
  words: number;
  characters: number;
  estimatedTokens: number;
}

export function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text.trim().split(/\s+/).length;
}

export function estimateTokens(words: number): number {
  return Math.ceil(words * 1.33);
}

export function splitIntoChunks(
  text: string,
  chunkSize: number
): Chunk[] {
  if (!text.trim()) {
    return [];
  }

  const words = text.trim().split(/\s+/);

  const chunks: Chunk[] = [];

  let index = 0;

  while (index < words.length) {
    let end = Math.min(index + chunkSize, words.length);

    // Try to end on a sentence boundary if possible
    if (end < words.length) {
      for (
        let i = end;
        i > index + Math.floor(chunkSize * 0.8);
        i--
      ) {
        const word = words[i];

        if (
          word.endsWith(".") ||
          word.endsWith("?") ||
          word.endsWith("!")
        ) {
          end = i + 1;
          break;
        }
      }
    }

    const textChunk = words
      .slice(index, end)
      .join(" ");

    const wordCount = countWords(textChunk);

    chunks.push({
      id: chunks.length,
      text: textChunk,
      words: wordCount,
      characters: textChunk.length,
      estimatedTokens: estimateTokens(wordCount),
    });

    index = end;
  }

  return chunks;
}