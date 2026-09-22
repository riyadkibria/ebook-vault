import { supabase } from "./supabase";


export async function getCopyCount(

  userId:string,

  chunkKey:string

):Promise<number>{


  const {

    data,

    error

  } = await supabase

    .from("chunk_progress")

    .select("copy_count")

    .eq(
      "user_id",
      userId
    )

    .eq(
      "chunk_key",
      chunkKey
    )

    .single();



  if(error){

    if(error.code === "PGRST116"){

      return 0;

    }


    console.error(
      error
    );


    return 0;

  }



  return data.copy_count ?? 0;


}