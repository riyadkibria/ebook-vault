"use client";

import { useEffect, useState } from "react";
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
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setChunks(data ?? []);
    }

    load();
  }, []);

  async function copyChunk(chunk: CopiedChunk) {
    const markdown = `# ${chunk.book_name}

## Chunk ${chunk.chunk_number}/${chunk.total_chunks}

**Words:** ${chunk.words}

**Tokens:** ${chunk.estimated_tokens}

**Times Copied:** ${chunk.copy_count}

---

${chunk.content}

---
`;

    await navigator.clipboard.writeText(markdown);

    setCopiedId(chunk.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-6xl p-6">

      <h1 className="mb-8 text-3xl font-bold text-slate-900">
        Copied Knowledge
      </h1>

      <div className="space-y-6">

        {chunks.map((chunk) => (
          <div
            key={chunk.id}
            className="rounded-2xl border bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b bg-slate-50 p-5">

              <div>
                <h2 className="text-lg font-semibold">
                  {chunk.book_name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Chunk {chunk.chunk_number} / {chunk.total_chunks}
                </p>
              </div>

              <button
                onClick={() => copyChunk(chunk)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                {copiedId === chunk.id ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-3 border-b bg-slate-50 p-5 text-sm sm:grid-cols-3">

              <div>
                <span className="font-medium">Words</span>
                <p>{chunk.words}</p>
              </div>

              <div>
                <span className="font-medium">Tokens</span>
                <p>{chunk.estimated_tokens}</p>
              </div>

              <div>
                <span className="font-medium">Copied</span>
                <p>{chunk.copy_count} times</p>
              </div>

            </div>

            <pre className="overflow-x-auto whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700">
{chunk.content}
            </pre>

          </div>
        ))}

      </div>

    </div>
  );
}