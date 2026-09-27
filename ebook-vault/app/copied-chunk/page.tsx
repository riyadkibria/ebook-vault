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
  Menu,
  ArrowLeft,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  function selectBook(name: string | null) {
    setSelectedBook(name);
    setSidebarOpen(false);
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#faf9f7] font-sans text-slate-800">
      {/* ---------------- Mobile sidebar backdrop ---------------- */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* ---------------- Sidebar ---------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm shadow-violet-200">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-slate-900">
              Copied Knowledge
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-2 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2.5 pb-3">
          <button
            onClick={() => selectBook(null)}
            className={`mb-0.5 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition ${
              selectedBook === null
                ? "bg-violet-50 font-medium text-violet-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <Hash size={12.5} className="opacity-60" />
              All books
            </span>
            <span className="text-[11px] text-slate-400">{chunks.length}</span>
          </button>

          {loading && (
            <div className="flex items-center gap-2 px-2.5 py-3 text-[12px] text-slate-400">
              <Loader2 size={13} className="animate-spin" />
              Loading…
            </div>
          )}

          {!loading &&
            bookNames.map((name) => (
              <button
                key={name}
                onClick={() => selectBook(name)}
                className={`mb-0.5 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition ${
                  selectedBook === name
                    ? "bg-violet-50 font-medium text-violet-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-[13px]">📘</span>
                  <span className="truncate">{name}</span>
                </span>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {bookCounts[name]}
                </span>
              </button>
            ))}
        </div>

        <div className="border-t border-slate-100 px-4 py-2.5 text-[10.5px] text-slate-400">
          {chunks.length} chunks · {totalWords.toLocaleString()} words
        </div>
      </aside>

      {/* ---------------- Main list ---------------- */}
      <main
        className={`flex min-w-0 flex-1 flex-col ${
          viewingChunk ? "hidden lg:flex lg:w-[44%]" : "flex"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-slate-200/80 bg-white/70 px-3 py-2.5 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={17} />
          </button>
          <div className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-slate-500">
            <span className="truncate font-medium text-slate-700">
              {selectedBook ?? "All books"}
            </span>
            {query && (
              <>
                <ChevronRight size={11} className="shrink-0 opacity-50" />
                <span className="truncate text-violet-600">"{query}"</span>
              </>
            )}
          </div>
          <span className="ml-auto shrink-0 text-[11.5px] text-slate-400">
            {filteredChunks.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-[12.5px]">Fetching chunks…</span>
            </div>
          )}

          {!loading && chunks.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
              <FileText size={22} className="opacity-40" />
              <p className="text-[13px]">No chunks yet</p>
            </div>
          )}

          {!loading && chunks.length > 0 && filteredChunks.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
              <Search size={18} className="opacity-40" />
              <p className="text-[13px]">No matches</p>
            </div>
          )}

          {!loading &&
            filteredChunks.map((chunk) => {
              const isViewing = viewingChunk?.id === chunk.id;
              return (
                <div
                  key={chunk.id}
                  onClick={() => setViewingChunk(chunk)}
                  className={`group flex cursor-pointer items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-2.5 transition-colors sm:px-4 ${
                    isViewing ? "bg-violet-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
                    {!viewingChunk && (
                      <span className="shrink-0 max-w-[120px] truncate text-slate-500 sm:max-w-[180px]">
                        📘 {chunk.book_name}
                      </span>
                    )}
                    <span className="shrink-0 font-medium text-slate-800">
                      #{chunk.chunk_number}
                      <span className="text-slate-400">/{chunk.total_chunks}</span>
                    </span>
                    <span className="hidden shrink-0 text-[11px] text-slate-400 sm:inline">
                      {chunk.words}w
                    </span>
                    <span className="hidden shrink-0 text-[11px] text-slate-400 md:inline">
                      ~{chunk.estimated_tokens}tok
                    </span>
                    {chunk.copy_count > 0 && (
                      <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
                        {chunk.copy_count}x
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      onClick={() => setViewingChunk(chunk)}
                      className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10.5px] text-slate-600 hover:border-violet-300 hover:text-violet-700"
                    >
                      <Eye size={11} />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={(e) => copyChunk(chunk, e)}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-medium shadow-sm transition-colors ${
                        copiedId === chunk.id
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 text-white hover:bg-violet-600"
                      }`}
                    >
                      {copiedId === chunk.id ? <Check size={11} /> : <Copy size={11} />}
                      <span className="hidden sm:inline">
                        {copiedId === chunk.id ? "Copied" : "Copy"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* ---------------- Reading pane ---------------- */}
      {viewingChunk && (
        <section className="fixed inset-0 z-50 flex w-full flex-col bg-white lg:static lg:z-auto lg:w-[56%] lg:border-l lg:border-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={() => setViewingChunk(null)}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              >
                <ArrowLeft size={17} />
              </button>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-slate-900">
                  📘 {viewingChunk.book_name}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  Chunk {viewingChunk.chunk_number}/{viewingChunk.total_chunks} ·{" "}
                  {viewingChunk.words.toLocaleString()} words · ~
                  {viewingChunk.estimated_tokens.toLocaleString()} tokens
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={(e) => copyChunk(viewingChunk, e)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium shadow-sm transition-colors ${
                  copiedId === viewingChunk.id
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-white hover:bg-violet-600"
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
                className="hidden rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:block"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#fffdfa] px-5 py-6 sm:px-8 sm:py-8">
            <p className="mx-auto max-w-2xl whitespace-pre-wrap font-serif text-[15px] leading-[1.9] text-slate-700">
              {viewingChunk.content}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}