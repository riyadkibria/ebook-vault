"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Copy,
  Check
} from "lucide-react";

import {
  supabase
} from "@/lib/supabase";


interface CopiedChunk {

  id:number;

  book_name:string;

  chunk_id:string;

  chunk_number:number;

  total_chunks:number;

  words:number;

  estimated_tokens:number;

  content:string;

  copy_count:number;

  created_at:string;

}



export default function CopiedChunksPage(){


  const [
    chunks,
    setChunks
  ] = useState<CopiedChunk[]>([]);



  const [
    copiedId,
    setCopiedId
  ] = useState<number | null>(null);




  useEffect(()=>{


    async function load(){


      const {
        data,
        error

      } = await supabase

        .from("copied_chunks")

        .select("*")

        .order(
          "created_at",
          {
            ascending:false
          }
        );



      if(error){

        console.error(error);

        return;

      }


      setChunks(
        data ?? []
      );


    }


    load();


  },[]);





  async function copyChunk(
    chunk:CopiedChunk
  ){


    await navigator.clipboard.writeText(
      chunk.content
    );


    setCopiedId(
      chunk.id
    );


    setTimeout(()=>{

      setCopiedId(null);

    },1200);


  }





  return (

    <div

      className="
      mx-auto
      max-w-4xl
      p-5
      "

    >



      <h1

        className="
        mb-5
        text-2xl
        font-bold
        text-slate-900
        "

      >

        Copied Knowledge

      </h1>




      <div

        className="
        overflow-hidden
        rounded-xl
        border
        bg-white
        "

      >



        {
          chunks.map(
            (chunk,index)=>(


              <div

                key={chunk.id}

                className="
                border-b
                last:border-b-0
                "

              >



                {
                  (
                    index === 0 ||
                    chunks[index - 1].book_name !== chunk.book_name
                  )

                  &&

                  <div

                    className="
                    bg-slate-100
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-slate-800
                    "

                  >

                    📘 {chunk.book_name}

                  </div>

                }





                <div

                  className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-2
                  hover:bg-slate-50
                  "

                >



                  <div

                    className="
                    flex
                    items-center
                    gap-4
                    text-sm
                    "

                  >



                    <span

                      className="
                      font-medium
                      text-slate-700
                      "

                    >

                      Chunk {chunk.chunk_number}/{chunk.total_chunks}

                    </span>




                    <span

                      className="
                      text-xs
                      text-slate-500
                      "

                    >

                      Copy {chunk.copy_count}x

                    </span>



                  </div>






                  <button

                    onClick={
                      ()=>copyChunk(chunk)
                    }

                    className="
                    flex
                    items-center
                    gap-1
                    rounded-md
                    bg-blue-600
                    px-2.5
                    py-1
                    text-xs
                    text-white
                    hover:bg-blue-700
                    "

                  >

                    {
                      copiedId === chunk.id

                      ?

                      <>

                      <Check size={13}/>

                      Done

                      </>

                      :

                      <>

                      <Copy size={13}/>

                      Copy

                      </>

                    }


                  </button>



                </div>



              </div>


            )

          )
        }



      </div>



    </div>

  );


}