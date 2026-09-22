import {
  supabase
} from "./supabase";



export async function increaseCopyCount(

  userId:string,

  chunkKey:string

){


  const {
    data,
    error

  } = await supabase

    .from("chunk_progress")

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .eq(
      "chunk_key",
      chunkKey
    )

    .single();




  // যদি database error হয়
  // (record না থাকলে PGRST116 আসবে)

  if(
    error &&
    error.code !== "PGRST116"
  ){

    console.error(
      "Supabase error:",
      error
    );

    return;

  }





  // আগে থেকে row থাকলে count বাড়াবে

  if(data){


    const {
      error:updateError

    } = await supabase

      .from("chunk_progress")

      .update({

        copy_count:
          data.copy_count + 1,

        updated_at:
          new Date()

      })

      .eq(

        "id",

        data.id

      );



    if(updateError){

      console.error(
        updateError
      );

    }


  }





  // নতুন chunk হলে নতুন row তৈরি করবে

  else{


    const {
      error:insertError

    } = await supabase

      .from("chunk_progress")

      .insert({

        user_id:userId,

        chunk_key:chunkKey,

        copy_count:1

      });



    if(insertError){

      console.error(
        insertError
      );

    }


  }


}