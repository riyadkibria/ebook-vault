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
  saveCopiedChunk,
  getCopyCount
} from "@/lib/chunkProgress";



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
    Load copy count
  */

  useEffect(()=>{


    async function loadCount(){

      const count = await getCopyCount(
        filename,
        chunk.id
      );

      setCopyCount(count);

    }


    loadCount();


  },[
    filename,
    chunk.id
  ]);







  async function copyChunk(){


    const chunkText =

`Book: ${filename}


Chunk ${current + 1}/${total}


${chunk.text}`;



    /*
      1. Copy to clipboard
    */

    await navigator.clipboard.writeText(
      chunkText
    );




    /*
      2. Save to Supabase

      Rule:
      Same book + same chunk id
      will NOT create duplicate

    */

    try{


      const result = await saveCopiedChunk({

        bookName: filename,

        chunkId: chunk.id,

        chunkNumber: current + 1,

        totalChunks: total,

        words: chunk.words,

        estimatedTokens:
          chunk.estimatedTokens,

        content:
          chunk.text

      });



      if(result){

        setCopyCount(
          result.copyCount
        );

      }



    }catch(error){

      console.error(
        "Chunk save failed:",
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
border-gray-200
bg-white/80
backdrop-blur-xl
shadow-lg
"

>



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
gap-2
"

>



<span

className="
inline-flex
items-center
gap-2
rounded-full
bg-blue-50
px-3
py-1
text-sm
font-semibold
text-blue-700
"

>

<FileText size={15}/>

AI Chunk

</span>




<span

className="
rounded-full
bg-gray-100
px-3
py-1
text-sm
"

>

{current + 1} / {total}

</span>





<span

className="
rounded-full
bg-gray-100
px-3
py-1
text-sm
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
bg-gray-100
px-3
py-1
text-sm
"

>

<Hash size={14}/>

{chunk.estimatedTokens}

</span>






<span

className="
inline-flex
items-center
gap-2
rounded-full
bg-green-50
px-3
py-1
text-sm
font-medium
text-green-700
"

>

<Copy size={14}/>

{copyCount} saved

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
rounded-xl
border
bg-white
px-3
py-2
text-sm
shadow-sm
outline-none
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






<div

className="
px-4
"

>

<div

className="
h-2
overflow-hidden
rounded-full
bg-gray-200
"

>


<div

className="
h-full
rounded-full
bg-gradient-to-r
from-blue-500
via-indigo-500
to-purple-500
transition-all
duration-500
"

style={{

width:`${progress}%`

}}


/>


</div>


</div>









<div

className="
flex
items-center
justify-between
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
items-center
justify-center
rounded-xl
border
transition
hover:bg-gray-100
disabled:opacity-30
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
transition
hover:scale-105
"

>


{

copied

?

<>

<Check size={16}/>

Saved

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
items-center
justify-center
rounded-xl
border
transition
hover:bg-gray-100
disabled:opacity-30
"

>


<ChevronRight size={20}/>


</button>





</div>



</div>


</div>


);


}