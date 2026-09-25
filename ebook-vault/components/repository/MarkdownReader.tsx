"use client";

import { useMemo, useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FileText } from "lucide-react";

import { markdownComponents } from "./MarkdownComponents";

import ChunkManager from "@/components/chunk-manager/ChunkManager";

import { splitIntoChunks } from "@/lib/chunk";
import { normalizeMarkdown } from "@/lib/normalizeMarkdown";


interface Props {
  content: string;
  fileName?: string;
}


export default function MarkdownReader({
  content,
  fileName,
}: Props) {


  const [chunkSize, setChunkSize] = useState(500);

  const [currentChunk, setCurrentChunk] = useState(0);


  const chunks = useMemo(() => {
    return splitIntoChunks(
      content,
      chunkSize
    );
  }, [
    content,
    chunkSize,
  ]);


  const selectedChunk = chunks[currentChunk];


  const cleanedMarkdown = useMemo(() => {

    return normalizeMarkdown(
      String(selectedChunk?.text ?? "")
    );

  }, [
    selectedChunk,
  ]);



  if (!content) {
    return (
      <div
        className="
          flex
          h-full
          items-center
          justify-center
          text-sm
          font-medium
          text-slate-400
        "
      >
        No content available.
      </div>
    );
  }



  return (
    <article
      className="
        mx-auto
        w-full
        max-w-5xl
        rounded-2xl
        border
        border-slate-200/70
        bg-white
        p-6
        shadow-sm
        shadow-slate-900/[0.03]
        ring-1
        ring-slate-900/[0.02]
        sm:p-10
      "
    >


      {fileName && (
        <div
          className="
            mb-8
            flex
            items-center
            gap-3
            border-b
            border-slate-100
            pb-5
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-100
            "
          >
            <FileText
              size={16}
              className="text-slate-500"
            />
          </div>


          <h1
            className="
              truncate
              text-xl
              font-semibold
              tracking-tight
              text-slate-800
              sm:text-2xl
            "
          >
            {fileName}
          </h1>

        </div>
      )}




      {selectedChunk && (
        <ChunkManager
          filename={fileName}
          chunk={selectedChunk}
          current={currentChunk}
          total={chunks.length}
          chunkSize={chunkSize}
          setChunkSize={(value) => {
            setChunkSize(value);
            setCurrentChunk(0);
          }}
          next={() => {
            setCurrentChunk((current) =>
              Math.min(
                current + 1,
                chunks.length - 1
              )
            );
          }}
          previous={() => {
            setCurrentChunk((current) =>
              Math.max(
                current - 1,
                0
              )
            );
          }}
        />
      )}





      <div
        className="
          max-w-none
          font-normal
        "
      >

        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
          ]}
          components={markdownComponents}
        >
          {cleanedMarkdown}
        </ReactMarkdown>


      </div>


    </article>
  );
}