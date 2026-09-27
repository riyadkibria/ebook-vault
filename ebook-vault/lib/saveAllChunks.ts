// ============================================================================
// File Location:
// lib/saveAllChunks.ts
// ============================================================================

import { Chunk } from "./chunkText";
import { saveChunk } from "./saveChunk";

interface SaveAllChunksProps {
  userId: string;
  bookName: string;
  chunks: Chunk[];
}

export async function saveAllChunks({
  userId,
  bookName,
  chunks,
}: SaveAllChunksProps): Promise<void> {
  if (!chunks.length) {
    throw new Error("No chunks available to save.");
  }

  for (let i = 0; i < chunks.length; i++) {
    await saveChunk({
      userId,
      bookName,
      chunk: chunks[i],
      chunkNumber: i + 1,
      totalChunks: chunks.length,
    });
  }
}