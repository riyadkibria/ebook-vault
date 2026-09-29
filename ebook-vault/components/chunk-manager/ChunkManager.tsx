// File location:
// components/chunk-manager/ChunkManager.tsx

"use client";

import { useEffect, useState } from "react";

import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Hash,
} from "lucide-react";

import type { Chunk } from "@/lib/chunk";

import { saveCopiedChunk, getCopyCount } from "@/lib/chunkProgress";

import { extractBookName, extractChapterName } from "@/lib/bookIdentity";

interface Props {
  filename?: string;
  chunk: Chunk;
  current: number;
  total: number;
  chunkSize: number;
  setChunkSize: (value: number) => void;
  next: () => void;
  previous: () => void;
}

const sizes = [500, 1000, 1500, 3000, 5000];

export default function ChunkManager({
  filename = "Document",
  chunk,
  current,
  total,
  chunkSize,
  setChunkSize,
  next,
  previous,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(0);

  const bookName = extractBookName(filename);
  const chapterName = extractChapterName(filename);

  useEffect(() => {
    async function loadCount() {
      try {
        const count = await getCopyCount(
          bookName,
          chapterName,
          chunk.id,
          chunkSize
        );

        setCopyCount(count);
      } catch (error) {
        console.error("Load copy count failed:", error);
      }
    }

    loadCount();
  }, [bookName, chapterName, chunk.id, chunkSize]);

  async function copyChunk() {
    const chunkText = `Book: ${bookName}


Chapter: ${chapterName}


Chunk ${current + 1}/${total}


${chunk.text}`;

    try {
      await navigator.clipboard.writeText(chunkText);

      const result = await saveCopiedChunk({
        bookName,
        chapterName,
        chunkId: chunk.id,
        chunkSize,
        chunkNumber: current + 1,
        totalChunks: total,
        words: chunk.words,
        estimatedTokens: chunk.estimatedTokens,
        content: chunk.text,
      });

      setCopyCount(result.copyCount);
    } catch (error) {
      console.error("Chunk save failed:", error);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  const progress = total === 0 ? 0 : ((current + 1) / total) * 100;

  return (
    // Mobile: full-bleed (100vw), docked to the very top like an e-reader header.
    // sm+: returns to a floating rounded card inside the page container.
    <div className="sticky top-0 z-30 mb-2 ml-[calc(50%-50vw)] w-screen sm:top-3 sm:mb-6 sm:ml-0 sm:w-auto">
      <div className="overflow-hidden border-b border-stone-200/80 bg-[#fcfbf8]/90 pt-[env(safe-area-inset-top)] shadow-[0_8px_24px_-16px_rgba(28,25,23,0.3)] backdrop-blur-xl sm:rounded-2xl sm:border sm:pt-0">
        {/* Book + chapter, chunk size */}
        <div className="flex items-center justify-between gap-3 px-3 pt-2 sm:px-4 sm:pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600 ring-1 ring-stone-200/70">
              <BookOpen size={15} strokeWidth={2} />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate font-serif text-[14px] font-semibold text-stone-900">
                {bookName}
              </p>

              <p className="truncate text-[11px] italic text-stone-500">
                {chapterName}
              </p>
            </div>
          </div>

          <div className="relative shrink-0">
            <select
              aria-label="Chunk size"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="h-8 appearance-none rounded-lg border border-stone-200 bg-white pl-2.5 pr-7 text-xs font-medium text-stone-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size} words
                </option>
              ))}
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-3 pt-2 sm:px-4">
          <button
            type="button"
            aria-label="Previous chunk"
            disabled={current === 0}
            onClick={previous}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition active:scale-95 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={copyChunk}
            className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgba(14,165,233,0.55)] transition active:scale-[0.98] ${
              copied
                ? "bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_6px_16px_-6px_rgba(16,185,129,0.55)]"
                : "bg-gradient-to-b from-sky-400 to-sky-500 hover:from-sky-400 hover:to-sky-600"
            }`}
          >
            {copied ? (
              <>
                <Check size={16} strokeWidth={2.5} />
                Saved
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy chunk
              </>
            )}
          </button>

          <button
            type="button"
            aria-label="Next chunk"
            disabled={current === total - 1}
            onClick={next}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition active:scale-95 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Reader-style footer: position + stats */}
        <div className="flex items-center justify-between px-3 pb-1.5 pt-2 text-[10.5px] tabular-nums text-stone-500 sm:px-4 sm:pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-stone-700">
              Chunk {current + 1} / {total}
            </span>

            <span>{chunk.words} words</span>

            <span className="inline-flex items-center gap-0.5">
              <Hash size={10} />
              {chunk.estimatedTokens}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {copyCount} saved
          </span>
        </div>

        {/* Progress line, flush to the bottom edge */}
        <div
          role="progressbar"
          aria-label="Chunk progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current + 1}
          className="h-0.5 w-full bg-stone-200/70 sm:h-1"
        >
          <div
            className="h-full bg-gradient-to-r from-sky-300 via-sky-400 to-indigo-400 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}