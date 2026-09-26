"use client";

import {
  useEffect,
  useState
} from "react";

import {
  FileDown
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





  function downloadMarkdown(
    chunk:CopiedChunk
  ){


    const markdown = `# ${chunk.book_name}


## Chunk ${chunk.chunk_number}/${chunk.total_chunks}


**Words:** ${chunk.words}


**Estimated Tokens:** ${chunk.estimated_tokens}


**Times Copied:** ${chunk.copy_count}



---


${chunk.content}


---
`;



    const blob = new Blob(

      [markdown],

      {
        type:"text/markdown"
      }

    );



    const url =
      URL.createObjectURL(blob);



    const link =
      document.createElement("a");



    link.href = url;



    link.download =
      `${chunk.book_name}-chunk-${chunk.chunk_number}.md`;



    document.body.appendChild(link);



    link.click();



    document.body.removeChild(link);



    URL.revokeObjectURL(url);


  }





  return (

    <div

      className="
      mx-auto
      max-w-5xl
      p-6
      "

    >


      <h1

        className="
        mb-8
        text-3xl
        font-bold
        text-slate-900
        "

      >

        Copied Knowledge

      </h1>





      <div

        className="
        space-y-5
        "

      >


        {
          chunks.map(
            (chunk)=>(


              <div

                key={chunk.id}

                className="
                rounded-xl
                border
                bg-white
                shadow-sm
                "

              >



                <div

                  className="
                  flex
                  items-center
                  justify-between
                  border-b
                  bg-slate-50
                  px-4
                  py-3
                  "

                >


                  <div>


                    <h2

                      className="
                      text-base
                      font-semibold
                      text-slate-900
                      "

                    >

                      {chunk.book_name}

                    </h2>



                    <p

                      className="
                      text-xs
                      text-slate-500
                      "

                    >

                      Chunk {chunk.chunk_number}/{chunk.total_chunks}

                    </p>


                  </div>





                  <button

                    onClick={
                      ()=>downloadMarkdown(chunk)
                    }

                    className="
                    flex
                    items-center
                    gap-1
                    rounded-md
                    bg-blue-600
                    px-2.5
                    py-1.5
                    text-xs
                    text-white
                    hover:bg-blue-700
                    "

                  >

                    <FileDown size={14}/>

                    Save .md

                  </button>



                </div>






                <div

                  className="
                  grid
                  grid-cols-3
                  gap-3
                  border-b
                  bg-slate-50
                  px-4
                  py-3
                  text-xs
                  "

                >


                  <div>

                    <span className="font-medium">
                      Words
                    </span>

                    <p>
                      {chunk.words}
                    </p>

                  </div>




                  <div>

                    <span className="font-medium">
                      Tokens
                    </span>

                    <p>
                      {chunk.estimated_tokens}
                    </p>

                  </div>




                  <div>

                    <span className="font-medium">
                      Copied
                    </span>

                    <p>
                      {chunk.copy_count}
                    </p>

                  </div>



                </div>






                <pre

                  className="
                  whitespace-pre-wrap
                  overflow-x-auto
                  p-5
                  text-sm
                  leading-7
                  text-slate-700
                  "

                >

{chunk.content}

                </pre>



              </div>


            )

          )
        }


      </div>



    </div>

  );


}