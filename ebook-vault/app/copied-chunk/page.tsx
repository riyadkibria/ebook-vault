"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check, Search, BookOpen, ChevronDown, Loader2, FileText } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("copied_chunks")
        .select("*")
        .order("book_name", { ascending: true })
        .order("chunk_number", { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setChunks(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const filteredChunks = useMemo(() => {
    if (!query.trim()) return chunks;
    const q = query.toLowerCase();
    return chunks.filter(
      (c) =>
        c.book_name.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q)
    );
  }, [chunks, query]);

  const groupedChunks = useMemo(() => {
    const grouped: Record<string, CopiedChunk[]> = {};

    for (const chunk of filteredChunks) {
      if (!grouped[chunk.book_name]) {
        grouped[chunk.book_name] = [];
      }
      grouped[chunk.book_name].push(chunk);
    }

    return grouped;
  }, [filteredChunks]);

  const totalWords = useMemo(
    () => chunks.reduce((sum, c) => sum + c.words, 0),
    [chunks]
  );

  async function copyChunk(chunk: CopiedChunk) {
    await navigator.clipboard.writeText(chunk.content);
    setCopiedId(chunk.id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  function toggleBook(bookName: string) {
    setCollapsed((prev) => ({ ...prev, [bookName]: !prev[bookName] }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <BookOpen size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Copied Knowledge
            </h1>
          </div>
          <p className="ml-11 text-sm text-slate-500">
            {loading
              ? "Loading your library…"
              : `${chunks.length} chunk${chunks.length === 1 ? "" : "s"} across ${
                  Object.keys(
                    chunks.reduce((acc, c) => ({ ...acc, [c.book_name]: true }), {} as Record<string, boolean>)
                  ).length
                } book${chunks.length === 1 ? "" : "s"} · ${totalWords.toLocaleString()} words`}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by book or content…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm">Fetching your chunks…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && chunks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <FileText size={28} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No chunks yet</p>
            <p className="max-w-xs text-xs text-slate-400">
              Copied chunks will show up here once they've been saved.
            </p>
          </div>
        )}

        {/* No search results */}
        {!loading && chunks.length > 0 && Object.keys(groupedChunks).length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Search size={22} className="text-slate-300" />
            <p className="text-sm text-slate-500">
              No results for <span className="font-medium text-slate-700">"{query}"</span>
            </p>
          </div>
        )}

        {/* Book groups */}
        {!loading && Object.keys(groupedChunks).length > 0 && (
          <div className="space-y-4">
            {Object.entries(groupedChunks).map(([bookName, bookChunks]) => {
              const isCollapsed = collapsed[bookName];

              return (
                <div
                  key={bookName}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Book Heading */}
                  <button
                    onClick={() => toggleBook(bookName)}
                    className="flex w-full items-center justify-between gap-3 bg-slate-50/80 px-5 py-3.5 text-left transition hover:bg-slate-100/80"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base">📘</span>
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {bookName}
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {bookChunks.length}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                        isCollapsed ? "-rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Chunks */}
                  {!isCollapsed && (
                    <div className="divide-y divide-slate-100">
                      {bookChunks.map((chunk) => (
                        <div
                          key={chunk.id}
                          className="group flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="font-medium text-slate-700">
                              Chunk {chunk.chunk_number}
                              <span className="text-slate-400">/{chunk.total_chunks}</span>
                            </span>

                            <span className="text-xs text-slate-400">
                              {chunk.words.toLocaleString()} words
                            </span>

                            <span className="text-xs text-slate-400">
                              ~{chunk.estimated_tokens.toLocaleString()} tokens
                            </span>

                            {chunk.copy_count > 0 && (
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                                Copied {chunk.copy_count}x
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => copyChunk(chunk)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                              copiedId === chunk.id
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-900 text-white hover:bg-slate-700"
                            }`}
                          >
                            {copiedId === chunk.id ? (
                              <>
                                <Check size={13} />
                                Copied
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}