// File location:
// lib/chunkProgress.ts


import { supabase } from "@/lib/supabase";



interface SaveChunkInput {

  bookName: string;

  chunkId: string | number;

  chunkNumber: number;

  totalChunks: number;

  words: number;

  estimatedTokens: number;

  content: string;

}






export async function saveCopiedChunk(
  data: SaveChunkInput
) {


  /*
    Unique identity:

    book_name + chunk_id

    First copy:
    create row

    Same chunk copied again:
    only increase copy_count

    No duplicate chunk
  */



  const {
    data: existing,
    error: findError

  } = await supabase

    .from("copied_chunks")

    .select(
      "id, copy_count"
    )

    .eq(
      "book_name",
      data.bookName
    )

    .eq(
      "chunk_id",
      String(data.chunkId)
    )

    .maybeSingle();





  if(findError){

    throw findError;

  }





  // Existing chunk found

  if(existing){



    const {
      data: updated,
      error

    } = await supabase

      .from("copied_chunks")

      .update({

        copy_count:
          existing.copy_count + 1,

        updated_at:
          new Date().toISOString()

      })

      .eq(
        "id",
        existing.id
      )

      .select(
        "copy_count"
      )

      .single();





    if(error){

      throw error;

    }



    return {

      copyCount:
        updated.copy_count

    };


  }








  // First time copy


  const {
    data: created,
    error

  } = await supabase

    .from("copied_chunks")

    .insert({

      book_name:
        data.bookName,

      chunk_id:
        String(data.chunkId),

      chunk_number:
        data.chunkNumber,

      total_chunks:
        data.totalChunks,

      words:
        data.words,

      estimated_tokens:
        data.estimatedTokens,

      content:
        data.content,

      copy_count:
        1

    })

    .select(
      "copy_count"
    )

    .single();





  if(error){

    throw error;

  }



  return {

    copyCount:
      created.copy_count

  };


}








export async function getCopyCount(

  bookName: string,

  chunkId: string | number

){



  const {

    data,

    error

  } = await supabase


    .from("copied_chunks")


    .select(
      "copy_count"
    )


    .eq(
      "book_name",
      bookName
    )


    .eq(
      "chunk_id",
      String(chunkId)
    )


    .maybeSingle();





  if(error){

    console.error(
      "Get copy count error:",
      error
    );


    return 0;

  }




  return data?.copy_count ?? 0;


}