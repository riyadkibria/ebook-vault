"use client";

import { useMemo, useState } from "react";

import {
  splitIntoChunks,
  type Chunk,
} from "@/lib/chunk";


export function useReaderChunks(
  content:string
){

  const [chunkSize,setChunkSize] =
    useState(1500);


  const [current,setCurrent] =
    useState(0);



  const chunks = useMemo(
    ()=>splitIntoChunks(
      content,
      chunkSize
    ),
    [
      content,
      chunkSize
    ]
  );



  const currentChunk =
    chunks[current];



  function changeChunkSize(
    size:number
  ){

    setChunkSize(size);

    setCurrent(0);

  }



  function next(){

    setCurrent(prev=>

      Math.min(
        prev+1,
        chunks.length-1
      )

    );

  }



  function previous(){

    setCurrent(prev=>

      Math.max(
        prev-1,
        0
      )

    );

  }



  return {

    chunks,

    current,

    currentChunk,

    chunkSize,

    setChunkSize:
      changeChunkSize,

    next,

    previous,

  };

}