"use client";


import ReactMarkdown from "react-markdown";

import { 
  BookOpen 
} from "lucide-react";


import ChunkManager from "@/components/chunk-manager/ChunkManager";


import { 
  useReaderChunks 
} from "./hooks/useReaderChunks";



interface Props {

  selectedFile:string;

  content:string;

  loading:boolean;

}



export default function Reader({

  selectedFile,

  content,

  loading,

}:Props){



  const {

    chunks,

    current,

    currentChunk,

    chunkSize,

    setChunkSize,

    next,

    previous,

  } = useReaderChunks(content);





  if(!selectedFile){


    return (

      <div

        className="
          flex
          h-full
          items-center
          justify-center
          bg-gradient-to-b
          from-slate-50
          to-white
        "

      >

        <div

          className="
            text-center
          "

        >

          <div

            className="
              mx-auto
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-slate-100
              to-slate-50
              ring-1
              ring-slate-900/5
            "

          >

            <BookOpen

              size={30}

              strokeWidth={1.5}

              className="
                text-slate-400
              "

            />

          </div>


          <p

            className="
              text-sm
              font-medium
              text-slate-400
            "

          >

            Select a chapter to begin reading

          </p>


        </div>


      </div>

    );

  }





  return (


    <section


      className="
        flex-1
        overflow-y-auto
        bg-gradient-to-b
        from-slate-50
        to-white
      "


    >



      <div


        className="
          mx-auto
          max-w-5xl
          px-6
          py-10
          lg:px-10
        "


      >




        {/* Header */}



        <div


          className="
            mb-8
            flex
            items-baseline
            gap-3
            border-b
            border-slate-200
            pb-5
          "


        >


          <h2


            className="
              truncate
              text-2xl
              font-semibold
              tracking-tight
              text-slate-900
              md:text-3xl
            "


          >


            {selectedFile}


          </h2>



        </div>







        {


          loading


          ?


          <div


            className="
              space-y-3
              animate-pulse
            "


          >


            <div className="h-4 w-full rounded-full bg-slate-200/70" />

            <div className="h-4 w-11/12 rounded-full bg-slate-200/70" />

            <div className="h-4 w-full rounded-full bg-slate-200/70" />

            <div className="h-4 w-4/5 rounded-full bg-slate-200/70" />

            <div className="h-4 w-10/12 rounded-full bg-slate-200/70" />


          </div>





          :



          <>



            {
              currentChunk && (

                <ChunkManager


                  filename={selectedFile}


                  chunk={currentChunk}


                  current={current}


                  total={chunks.length}


                  chunkSize={chunkSize}


                  setChunkSize={setChunkSize}


                  next={next}


                  previous={previous}


                />

              )
            }







            <article


              className="
                prose
                prose-lg
                max-w-none

                prose-headings:font-semibold
                prose-headings:tracking-tight
                prose-headings:text-slate-900

                prose-p:text-slate-700
                prose-p:leading-8

                prose-a:text-slate-900
                prose-a:underline
                prose-a:decoration-slate-300
                prose-a:underline-offset-4

                prose-strong:text-slate-900

                prose-blockquote:border-l-slate-300
                prose-blockquote:text-slate-500

                prose-hr:border-slate-200
              "


            >



              <ReactMarkdown>


                {

                  currentChunk?.text

                  ??

                  ""

                }


              </ReactMarkdown>



            </article>




          </>


        }




      </div>


    </section>


  );

}