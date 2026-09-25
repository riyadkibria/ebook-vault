"use client";

import {
  useMemo,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FileText } from "lucide-react";

import { markdownComponents } from "./MarkdownComponents";

import ChunkManager from "@/components/chunk-manager/ChunkManager";

import { splitIntoChunks } from "@/lib/chunk";


interface Props {
  content: string;
  fileName?: string;
}



function normalizeMarkdown(text:string){

  return text

    // remove broken bold markers
    .replace(/\*\*(.*?)$/, "$1")

    // remove broken italic marker
    .replace(/\*(.*?)$/, "$1")

    // remove accidental html strong tags
    .replace(/<\/?strong>/gi,"")

    // normalize extra whitespace
    .replace(/\n{3,}/g,"\n\n")

    .trim();

}



export default function MarkdownReader({
  content,
  fileName,
}:Props){


  const [
    chunkSize,
    setChunkSize
  ] = useState(500);


  const [
    currentChunk,
    setCurrentChunk
  ] = useState(0);



  const chunks = useMemo(()=>{

    return splitIntoChunks(
      content,
      chunkSize
    );

  },[
    content,
    chunkSize
  ]);



  const selectedChunk =
    chunks[currentChunk];



  const cleanChunk =
    normalizeMarkdown(
      selectedChunk?.text ?? ""
    );



  if(!content){

    return (

      <div
        className="
          flex
          h-full
          items-center
          justify-center
          text-sm
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
        sm:p-10
      "

    >



      {
        fileName && (

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

            <FileText
              size={16}
              className="text-slate-500"
            />


            <h1

              className="
                text-xl
                font-semibold
                text-slate-800
              "

            >

              {fileName}

            </h1>


          </div>

        )
      }




      {
        selectedChunk && (

          <ChunkManager

            filename={fileName}

            chunk={selectedChunk}

            current={currentChunk}

            total={chunks.length}

            chunkSize={chunkSize}

            setChunkSize={(value)=>{

              setChunkSize(value);

              setCurrentChunk(0);

            }}


            next={()=>{

              setCurrentChunk(
                current =>
                Math.min(
                  current + 1,
                  chunks.length - 1
                )
              );

            }}


            previous={()=>{

              setCurrentChunk(
                current =>
                Math.max(
                  current - 1,
                  0
                )
              );

            }}

          />

        )
      }




      <div
        className="
          max-w-none
          text-base
          font-normal
          leading-8
          text-slate-600
        "
      >


        <ReactMarkdown

          remarkPlugins={[
            remarkGfm
          ]}

          components={markdownComponents}

        >

          {cleanChunk}


        </ReactMarkdown>


      </div>


    </article>

  );

}