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

    },1500);


  }





  return (

    <div

      className="
      mx-auto
      max-w-3xl
      p-6
      "

    >


      <h1

        className="
        mb-6
        text-2xl
        font-bold
        text-slate-900
        "

      >

        Copied Chunks

      </h1>





      <div

        className="
        space-y-3
        "

      >


        {
          chunks.map(
            (chunk)=>(


              <div

                key={chunk.id}

                className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                bg-white
                px-4
                py-3
                shadow-sm
                "

              >



                <div

                  className="
                  text-sm
                  text-slate-700
                  "

                >

                  <span className="font-semibold">

                    Chunk {chunk.chunk_number}/{chunk.total_chunks}

                  </span>



                  <span className="ml-4 text-xs text-slate-500">

                    Copied {chunk.copy_count}x

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
                  px-3
                  py-1.5
                  text-xs
                  text-white
                  hover:bg-blue-700
                  "

                >

                  {
                    copiedId === chunk.id

                    ?

                    <>

                    <Check size={14}/>

                    Copied

                    </>

                    :

                    <>

                    <Copy size={14}/>

                    Copy

                    </>

                  }


                </button>



              </div>


            )

          )
        }


      </div>



    </div>

  );


}