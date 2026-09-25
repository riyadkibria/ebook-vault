// File location:
// components/saved-chunks/SavedChunkList.tsx


"use client";


import {
  Copy,
  Check
} from "lucide-react";


import {
  useState
} from "react";


import type {
  SaveChunk
} from "@/lib/saveChunk";



interface Props {

  chunks: SaveChunk[];

}



export default function SavedChunkList({
  chunks
}: Props) {


  const [copied, setCopied] = useState<number | null>(null);



  async function copyMarkdown(
    chunk: SaveChunk
  ) {


    const markdown =

`# ${chunk.book_name}


## Chunk ${chunk.chunk_number}/${chunk.total_chunks}


## Metadata

- Words: ${chunk.words}
- Estimated Tokens: ${chunk.estimated_tokens}
- Copy Count: ${chunk.copy_count}


---


${chunk.content}


---


Source:
${chunk.book_name}
`;



    try {


      await navigator.clipboard.writeText(
        markdown
      );


      setCopied(
        chunk.id ?? null
      );


      setTimeout(() => {

        setCopied(null);

      }, 1500);



    } catch(error) {


      console.error(
        "Copy failed:",
        error
      );


    }


  }




  return (

    <div
      className="
        space-y-6
      "
    >


      {
        chunks.map((chunk) => (


          <div

            key={chunk.id}

            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "

          >



            <div

              className="
                mb-4
                flex
                items-center
                justify-between
                gap-4
              "

            >



              <div>


                <h2

                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                  "

                >

                  {chunk.book_name}

                </h2>



                <p

                  className="
                    text-sm
                    text-slate-500
                  "

                >

                  Chunk {chunk.chunk_number} of {chunk.total_chunks}

                </p>


              </div>




              <button

                onClick={() => copyMarkdown(chunk)}

                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-slate-700
                "

              >


                {
                  copied === chunk.id

                  ?

                  <>

                    <Check size={16}/>

                    Copied

                  </>


                  :

                  <>

                    <Copy size={16}/>

                    Copy Markdown

                  </>

                }


              </button>



            </div>





            <div

              className="
                rounded-xl
                bg-slate-50
                p-5
                text-sm
                leading-7
                text-slate-700
                whitespace-pre-wrap
              "

            >

              {chunk.content}

            </div>



          </div>


        ))

      }


    </div>

  );


}