// File location:
// lib/saveChunk.ts


import { supabase } from "./supabase";



export interface SaveChunk {

  id?: number;


  user_id:string;


  book_name:string;


  chunk_id:string | number;


  chunk_number:number;


  total_chunks:number;


  content:string;


  words:number;


  estimated_tokens:number;


  copy_count:number;


  created_at?:string;


}




interface SaveChunkProps {

  userId:string;

  bookName:string;

  chunk:any;

  chunkNumber:number;

  totalChunks:number;

}




export async function saveChunk({

  userId,

  bookName,

  chunk,

  chunkNumber,

  totalChunks,

}:SaveChunkProps){



  const { data,error } = await supabase

    .from("chunk_library")

    .upsert(

      {

        user_id:userId,

        book_name:bookName,

        chunk_id:String(chunk.id),

        chunk_number:chunkNumber,

        total_chunks:totalChunks,

        content:chunk.text,

        words:chunk.words,

        estimated_tokens:chunk.estimatedTokens,

        copy_count:1,

      },

      {

        onConflict:
        "user_id,book_name,chunk_id"

      }

    )

    .select()

    .single();



  if(error){

    console.error(
      "Save chunk error:",
      error
    );

    throw error;

  }



  return data;

}