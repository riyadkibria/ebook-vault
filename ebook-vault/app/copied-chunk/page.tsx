"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CopiedChunk {
  id: number;
  book_name: string;
  chunk_id: string;
  chunk_number: number;
  total_chunks: number;
  words: number;
  estimated_tokens: number;
  content: string;
  copy_count: number;
  created_at: string;
}

export default function CopiedChunksPage() {
  const [chunks, setChunks] = useState<CopiedChunk[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("copied_chunks")
        .select("*")
        .order("book_name", { ascending: true })
        .order("chunk_number", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setChunks(data ?? []);
    }

    load();
  }, []);

  const groupedChunks = useMemo(() => {
    const grouped: Record<string, CopiedChunk[]> = {};

    for (const chunk of chunks) {
      if (!grouped[chunk.book_name]) {
        grouped[chunk.book_name] = [];
      }

      grouped[chunk.book_name].push(chunk);
    }

    return grouped;
  }, [chunks]);

  async function copyChunk(chunk: CopiedChunk) {
    await navigator.clipboard.writeText(chunk.content);

    setCopiedId(chunk.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-4xl p-5">
      <h1 className="mb-5 text-2xl font-bold text-slate-900">
        Copied Knowledge
      </h1>

      <div className="overflow-hidden rounded-xl border bg-white">
        {Object.entries(groupedChunks).map(([bookName, bookChunks]) => (
          <div key={bookName}>
            {/* Book Heading */}
            <div className="bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
              📘 {bookName}
            </div>

            {/* Chunks */}
            {bookChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="flex items-center justify-between border-t px-4 py-2 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-slate-700">
                    Chunk {chunk.chunk_number}/{chunk.total_chunks}
                  </span>

                  <span className="text-xs text-slate-500">
                    {chunk.words} words
                  </span>

                  <span className="text-xs text-slate-500">
                    ~{chunk.estimated_tokens} tokens
                  </span>

                  <span className="text-xs text-slate-500">
                    Copy {chunk.copy_count}x
                  </span>
                </div>

                <button
                  onClick={() => copyChunk(chunk)}
                  className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white transition hover:bg-blue-700"
                >
                  {copiedId === chunk.id ? (
                    <>
                      <Check size={13} />
                      Done
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}