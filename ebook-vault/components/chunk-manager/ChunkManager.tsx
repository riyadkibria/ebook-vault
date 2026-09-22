"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
 FileText,
  Hash,
} from "lucide-react";

import { splitIntoChunks } from "@/lib/chunk";

interface Props {
  content: string;
  filename?: string;
}

export default function ChunkManager({
  content,
  filename = "Document",
}: Props) {
  const [chunkSize, setChunkSize] = useState(1500);
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);

  const chunks = useMemo(
    () => splitIntoChunks(content, chunkSize),
    [content, chunkSize]
  );

  const chunk = chunks[current];

  if (!chunk) return null;

  async function copyChunk() {
    const text = `Book: ${filename}

Chunk ${current + 1}/${chunks.length}

${chunk.text}`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  const progress = ((current + 1) / chunks.length) * 100;

  return (
    <div className="sticky top-3 z-20 mb-6">

      <div className="rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-xl shadow-lg">

        {/* Header */}

        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap items-center gap-2">

            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <FileText size={15} />
              AI Chunk
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {current + 1} / {chunks.length}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {chunk.words} words
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm hidden sm:inline-flex items-center gap-1">
              <Hash size={14} />
              {chunk.estimatedTokens} tokens
            </span>
          </div>

          <select
            value={chunkSize}
            onChange={(e) => {
              setChunkSize(Number(e.target.value));
              setCurrent(0);
            }}
            className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500"
          >
            <option value={500}>500 words</option>
            <option value={1000}>1000 words</option>
            <option value={1500}>1500 words</option>
            <option value={3000}>3000 words</option>
            <option value={5000}>5000 words</option>
          </select>
        </div>

        {/* Progress */}

        <div className="px-4 pb-2">

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between p-4">

          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white transition hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={copyChunk}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:scale-[1.03] hover:shadow-lg active:scale-95"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Chunk
              </>
            )}
          </button>

          <button
            disabled={current === chunks.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white transition hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </div>

    </div>
  );
}