import { supabase } from "./supabase";


interface SaveChunkProps {

  userId:string;

  bookName:string;

  chunk:any;

  chunkNumber:number;

}



export async function saveChunk({

  userId,

  bookName,

  chunk,

  chunkNumber,

}:SaveChunkProps){



const {data,error}=await supabase

.from("chunk_library")

.upsert(

{

user_id:userId,

book_name:bookName,

chunk_id:chunk.id,

chunk_number:chunkNumber,

content:chunk.text,

words:chunk.words,

tokens:chunk.estimatedTokens,

},


{

onConflict:
"user_id,book_name,chunk_id"

}


)

.select();



if(error){

throw error;

}


return data;


}