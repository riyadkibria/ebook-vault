// File location:
// components/chunk-manager/ChunkManager.tsx


"use client";


import {
  useEffect,
  useState
} from "react";


import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Hash,
} from "lucide-react";


import type { Chunk } from "@/lib/chunk";


import {
  increaseCopyCount
} from "@/lib/chunkProgress";


import {
  getCopyCount
} from "@/lib/getCopyCount";



interface Props {

  filename?: string;

  chunk: Chunk;

  current:number;

  total:number;

  chunkSize:number;

  setChunkSize:(value:number)=>void;

  next:()=>void;

  previous:()=>void;

}



const sizes = [

  500,

  1000,

  1500,

  3000,

  5000,

];




export default function ChunkManager({

  filename="Document",

  chunk,

  current,

  total,

  chunkSize,

  setChunkSize,

  next,

  previous,

}:Props){



  const [copied,setCopied] = useState(false);


  const [copyCount,setCopyCount] = useState(0);





  /*
    Load saved copy count
    from Supabase after opening chunk
  */

  useEffect(()=>{


    async function loadCopyCount(){


      const count = await getCopyCount(

        "riyad",

        `${filename}-chunk-${chunk.id}`

      );


      setCopyCount(count);


    }



    loadCopyCount();



  },[
    filename,
    chunk.id
  ]);






  async function copyChunk(){



    const text =

`Book: ${filename}


Chunk ${current + 1}/${total}


${chunk.text}`;





    await navigator.clipboard.writeText(text);





    try{


      const newCount = await increaseCopyCount(

        "riyad",

        `${filename}-chunk-${chunk.id}`

      );



      setCopyCount(newCount);



    }catch(error){


      console.error(

        "Copy count update failed:",

        error

      );


    }





    setCopied(true);



    setTimeout(()=>{


      setCopied(false);


    },1500);



  }






  const progress =

    total === 0

    ? 0

    :

    ((current + 1) / total) * 100;







  return (



    <div

      className="
        sticky
        top-3
        z-20
        mb-6
      "

    >



      <div

        className="
          rounded-2xl
          border
          border-slate-200/80
          bg-white/75
          backdrop-blur-xl
          shadow-[0_8px_30px_rgba(15,23,42,0.08)]
        "

      >




        {/* Header */}



        <div

          className="
            flex
            flex-col
            gap-3
            p-4
            md:flex-row
            md:items-center
            md:justify-between
          "

        >



          <div

            className="
              flex
              flex-wrap
              items-center
              gap-1.5
            "

          >




            <span

              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-blue-50
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-700
                ring-1
                ring-blue-600/10
              "

            >

              <FileText size={13}/>

              AI Chunk

            </span>






            <span

              className="
                rounded-full
                bg-slate-100
                px-3
                py-1
                text-xs
                font-medium
                text-slate-600
              "

            >

              {current + 1} / {total}

            </span>






            <span

              className="
                rounded-full
                bg-slate-100
                px-3
                py-1
                text-xs
                font-medium
                text-slate-600
              "

            >

              {chunk.words} words

            </span>







            <span

              className="
                hidden
                sm:inline-flex
                items-center
                gap-1
                rounded-full
                bg-slate-100
                px-3
                py-1
                text-xs
                font-medium
                text-slate-600
              "

            >

              <Hash size={12}/>

              {chunk.estimatedTokens}

            </span>








            {/* Permanent Copy Counter */}



            <span

              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-emerald-50
                px-3
                py-1
                text-xs
                font-semibold
                text-emerald-700
                ring-1
                ring-emerald-600/10
              "

            >

              <Copy size={13}/>


              {copyCount} copied


            </span>





          </div>









          <select


            value={chunkSize}


            onChange={(e)=>

              setChunkSize(

                Number(
                  e.target.value
                )

              )

            }


            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-slate-700
              shadow-sm
              outline-none
              transition-colors
              hover:border-slate-300
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "


          >


            {

              sizes.map(size=>(


                <option

                  key={size}

                  value={size}

                >

                  {size} words


                </option>



              ))

            }



          </select>





        </div>









        {/* Progress */}




        <div

          className="
            px-4
          "

        >



          <div

            className="
              h-1.5
              overflow-hidden
              rounded-full
              bg-slate-100
            "

          >



            <div

              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-blue-500
                to-blue-600
                transition-all
                duration-500
                ease-out
              "

              style={{

                width:`${progress}%`

              }}

            />



          </div>



        </div>









        {/* Controls */}




        <div

          className="
            flex
            items-center
            justify-between
            gap-3
            p-4
          "

        >





          <button


            disabled={current===0}


            onClick={previous}


            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              text-slate-600
              transition-colors
              hover:border-slate-300
              hover:bg-slate-50
              disabled:opacity-30
              disabled:hover:bg-transparent
              disabled:hover:border-slate-200
            "


          >


            <ChevronLeft size={20}/>


          </button>









          <button


            onClick={copyChunk}


            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-md
              shadow-blue-600/20
              transition-all
              duration-200
              hover:shadow-lg
              hover:shadow-blue-600/30
              active:scale-[0.98]
            "


          >



            {

              copied

              ?

              <>

                <Check size={16}/>

                Copied


              </>


              :


              <>

                <Copy size={16}/>

                Copy Chunk


              </>



            }



          </button>









          <button


            disabled={current===total-1}


            onClick={next}


            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              text-slate-600
              transition-colors
              hover:border-slate-300
              hover:bg-slate-50
              disabled:opacity-30
              disabled:hover:bg-transparent
              disabled:hover:border-slate-200
            "


          >



            <ChevronRight size={20}/>



          </button>





        </div>






      </div>



    </div>



  );


}