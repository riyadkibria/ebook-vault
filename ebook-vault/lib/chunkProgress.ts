// File location:
// lib/chunkProgress.ts

import { supabase } from "./supabase";



export async function increaseCopyCount(

  userId:string,

  chunkKey:string

):Promise<number>{



  const {

    data,

    error

  } = await supabase

    .from("chunk_progress")

    .select("id, copy_count")

    .eq(

      "user_id",

      userId

    )

    .eq(

      "chunk_key",

      chunkKey

    )

    .single();





  // Other database errors

  if(

    error &&

    error.code !== "PGRST116"

  ){

    console.error(

      "Supabase select error:",

      error

    );


    return 0;

  }





  // Existing chunk

  if(data){



    const newCount =

      data.copy_count + 1;



    const {

      error:updateError

    } = await supabase

      .from("chunk_progress")

      .update({

        copy_count:newCount,

        updated_at:new Date()

      })

      .eq(

        "id",

        data.id

      );




    if(updateError){

      console.error(

        "Supabase update error:",

        updateError

      );


      return data.copy_count;

    }



    return newCount;



  }





  // New chunk

  const {

    data:insertData,

    error:insertError

  } = await supabase

    .from("chunk_progress")

    .insert({

      user_id:userId,

      chunk_key:chunkKey,

      copy_count:1,

      updated_at:new Date()

    })

    .select("copy_count")

    .single();





  if(insertError){

    console.error(

      "Supabase insert error:",

      insertError

    );


    return 0;

  }





  return insertData.copy_count;


}