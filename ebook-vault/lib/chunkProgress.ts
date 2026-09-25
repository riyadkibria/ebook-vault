import { supabase } from "@/lib/supabase";


interface SaveChunkInput {

  bookName:string;

  chunkId:string | number;

  chunkNumber:number;

  totalChunks:number;

  words:number;

  estimatedTokens:number;

  content:string;

}



export async function saveCopiedChunk(
  data:SaveChunkInput
){


  /*
    Unique rule:
    book_name + chunk_id

    Same chunk copied again:
    update copy_count only

  */


  const { data:existing } = await supabase

    .from("copied_chunks")

    .select("*")

    .eq(
      "book_name",
      data.bookName
    )

    .eq(
      "chunk_id",
      String(data.chunkId)
    )

    .single();




  if(existing){


    const {data:updated,error}=

    await supabase

    .from("copied_chunks")

    .update({

      copy_count:
        existing.copy_count + 1,

      updated_at:
        new Date()

    })

    .eq(
      "id",
      existing.id
    )

    .select()

    .single();



    if(error)
      throw error;



    return {

      copyCount:
        updated.copy_count

    };


  }





  const {data:created,error}=

  await supabase

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

    copy_count:1

  })

  .select()

  .single();




  if(error)
    throw error;



  return {

    copyCount:
      created.copy_count

  };


}







export async function getCopyCount(

bookName:string,

chunkId:string | number

){


const {data}=await supabase

.from("copied_chunks")

.select("copy_count")

.eq(
"book_name",
bookName
)

.eq(
"chunk_id",
String(chunkId)
)

.single();



return data?.copy_count ?? 0;


}