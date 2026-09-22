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
          text-gray-400
        "

      >

        <div

          className="
            text-center
          "

        >

          <BookOpen

            size={48}

            className="
              mx-auto
              mb-4
              opacity-30
            "

          />


          <p>

            Select a chapter

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
          py-8
          lg:px-10
        "


      >




        {/* Header */}



        <div


          className="
            mb-8
            border-b
            pb-4
          "


        >


          <h2


            className="
              truncate
              text-xl
              font-semibold
              md:text-2xl
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
              animate-pulse
              text-gray-400
            "


          >


            Loading chapter...


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
                max-w-none

                prose-headings:text-gray-900

                prose-p:text-gray-700

                prose-p:leading-8
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