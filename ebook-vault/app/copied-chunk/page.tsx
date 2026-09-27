"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Check,
  Search,
  BookOpen,
  ChevronRight,
  Loader2,
  FileText,
  Eye,
  X,
  Hash,
} from "lucide-react";
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
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [viewingChunk, setViewingChunk] = useState<CopiedChunk | null>(null);

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

  // ---- Derived data ----

  const bookCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of chunks) counts[c.book_name] = (counts[c.book_name] ?? 0) + 1;
    return counts;
  }, [chunks]);

  const bookNames = useMemo(
    () => Object.keys(bookCounts).sort((a, b) => a.localeCompare(b)),
    [bookCounts]
  );

  const filteredChunks = useMemo(() => {
    let result = chunks;

    if (selectedBook) {
      result = result.filter((c) => c.book_name === selectedBook);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.book_name.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q)
      );
    }

    return result;
  }, [chunks, selectedBook, query]);

  const totalWords = useMemo(
    () => chunks.reduce((sum, c) => sum + c.words, 0),
    [chunks]
  );

  // ---- Actions ----

  async function copyChunk(chunk: CopiedChunk, e?: React.MouseEvent) {
    e?.stopPropagation();
    await navigator.clipboard.writeText(chunk.content);
    setCopiedId(chunk.id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1e1e1e] font-sans text-[#dcddde]">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-[#2a2a2a] bg-[#181818]">
        <div className="flex items-center gap-2 px-3 py-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#7c5cff]/20">
            <BookOpen size={13} className="text-[#a390ff]" />
          </div>
          <span className="text-[13px] font-semibold text-[#e6e6e6]">
            Copied Knowledge
          </span>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              size={12.5}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6e6e6e]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-md border border-[#2f2f2f] bg-[#232323] py-1.5 pl-7 pr-2 text-[12px] text-[#dcddde] outline-none placeholder:text-[#6e6e6e] focus:border-[#7c5cff]/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <button
            onClick={() => setSelectedBook(null)}
            className={`mb-0.5 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] transition ${
              selectedBook === null
                ? "bg-[#7c5cff]/15 text-[#c9bfff]"
                : "text-[#b3b3b3] hover:bg-[#2a2a2a]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Hash size={12} className="opacity-60" />
              All books
            </span>
            <span className="text-[10.5px] text-[#7a7a7a]">{chunks.length}</span>
          </button>

          {loading && (
            <div className="flex items-center gap-2 px-2 py-3 text-[11.5px] text-[#6e6e6e]">
              <Loader2 size={12} className="animate-spin" />
              Loading…
            </div>
          )}

          {!loading &&
            bookNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedBook(name)}
                className={`mb-0.5 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] transition ${
                  selectedBook === name
                    ? "bg-[#7c5cff]/15 text-[#c9bfff]"
                    : "text-[#b3b3b3] hover:bg-[#2a2a2a]"
                }`}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="shrink-0 text-[12px] opacity-80">📘</span>
                  <span className="truncate">{name}</span>
                </span>
                <span className="shrink-0 text-[10.5px] text-[#7a7a7a]">
                  {bookCounts[name]}
                </span>
              </button>
            ))}
        </div>

        <div className="border-t border-[#2a2a2a] px-3 py-2 text-[10.5px] text-[#6e6e6e]">
          {chunks.length} chunks · {totalWords.toLocaleString()} words
        </div>
      </aside>

      {/* ---------------- Main list ---------------- */}
      <main
        className={`flex min-w-0 flex-col transition-all ${
          viewingChunk ? "w-[42%]" : "flex-1"
        }`}
      >
        <div className="flex items-center gap-1.5 border-b border-[#2a2a2a] px-4 py-2.5 text-[12px] text-[#8a8a8a]">
          <span>{selectedBook ?? "All books"}</span>
          {query && (
            <>
              <ChevronRight size={11} className="opacity-50" />
              <span className="text-[#a390ff]">"{query}"</span>
            </>
          )}
          <span className="ml-auto text-[#6e6e6e]">{filteredChunks.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6e6e6e]">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-[12px]">Fetching chunks…</span>
            </div>
          )}

          {!loading && chunks.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#6e6e6e]">
              <FileText size={22} className="opacity-40" />
              <p className="text-[12.5px]">No chunks yet</p>
            </div>
          )}

          {!loading && chunks.length > 0 && filteredChunks.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#6e6e6e]">
              <Search size={18} className="opacity-40" />
              <p className="text-[12.5px]">No matches</p>
            </div>
          )}

          {!loading &&
            filteredChunks.map((chunk) => {
              const isViewing = viewingChunk?.id === chunk.id;
              return (
                <div
                  key={chunk.id}
                  onClick={() => setViewingChunk(chunk)}
                  className={`group flex cursor-pointer items-center justify-between gap-3 border-b border-[#232323] px-4 py-2 transition-colors ${
                    isViewing ? "bg-[#7c5cff]/10" : "hover:bg-[#242424]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3 text-[12px]">
                    {!viewingChunk && (
                      <span className="shrink-0 truncate max-w-[140px] text-[#8a8a8a]">
                        📘 {chunk.book_name}
                      </span>
                    )}
                    <span className="shrink-0 font-medium text-[#dcddde]">
                      #{chunk.chunk_number}
                      <span className="text-[#6e6e6e]">/{chunk.total_chunks}</span>
                    </span>
                    <span className="hidden shrink-0 text-[10.5px] text-[#6e6e6e] sm:inline">
                      {chunk.words}w
                    </span>
                    <span className="hidden shrink-0 text-[10.5px] text-[#6e6e6e] md:inline">
                      ~{chunk.estimated_tokens}tok
                    </span>
                    {chunk.copy_count > 0 && (
                      <span className="shrink-0 rounded-full bg-[#7c5cff]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#a390ff]">
                        {chunk.copy_count}x
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setViewingChunk(chunk)}
                      className="flex items-center gap-1 rounded-md border border-[#333] px-2 py-1 text-[10.5px] text-[#b3b3b3] hover:border-[#7c5cff]/50 hover:text-[#c9bfff]"
                    >
                      <Eye size={11} />
                      View
                    </button>
                    <button
                      onClick={(e) => copyChunk(chunk, e)}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-medium transition-colors ${
                        copiedId === chunk.id
                          ? "bg-emerald-600 text-white"
                          : "bg-[#7c5cff] text-white hover:bg-[#8f6dff]"
                      }`}
                    >
                      {copiedId === chunk.id ? <Check size={11} /> : <Copy size={11} />}
                      {copiedId === chunk.id ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* ---------------- Reading pane ---------------- */}
      {viewingChunk && (
        <section className="flex w-[58%] flex-col border-l border-[#2a2a2a] bg-[#1a1a1a]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#e6e6e6]">
                📘 {viewingChunk.book_name}
              </p>
              <p className="text-[11px] text-[#6e6e6e]">
                Chunk {viewingChunk.chunk_number}/{viewingChunk.total_chunks} ·{" "}
                {viewingChunk.words.toLocaleString()} words · ~
                {viewingChunk.estimated_tokens.toLocaleString()} tokens
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={(e) => copyChunk(viewingChunk, e)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                  copiedId === viewingChunk.id
                    ? "bg-emerald-600 text-white"
                    : "bg-[#7c5cff] text-white hover:bg-[#8f6dff]"
                }`}
              >
                {copiedId === viewingChunk.id ? (
                  <>
                    <Check size={12} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={() => setViewingChunk(null)}
                className="rounded-md p-1.5 text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#dcddde]"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className="whitespace-pre-wrap font-serif text-[14.5px] leading-[1.85] text-[#d4d4d4]">
              {viewingChunk.content}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}