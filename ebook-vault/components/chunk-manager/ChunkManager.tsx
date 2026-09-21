"use client";

import {
    useMemo,
    useState
} from "react";

import {
    Copy,
    Check,
    ChevronLeft,
    ChevronRight
} from "lucide-react";


import {
    splitIntoChunks
} from "@/lib/chunk";


import ChunkStats from "./ChunkStats";

import ChunkSizeSelector from "./ChunkSizeSelector";

import ChunkProgress from "./ChunkProgress";




interface Props {

    content:string;

    filename?:string;

}




export default function ChunkManager({

    content,

    filename="Document"

}:Props){



    const [chunkSize,setChunkSize]
    =
    useState(1500);



    const [currentChunk,setCurrentChunk]
    =
    useState(0);



    const [copied,setCopied]
    =
    useState(false);




    const chunks =
    useMemo(()=>{

        return splitIntoChunks(

            content,

            chunkSize

        );

    },[
        content,
        chunkSize
    ]);





    const chunk =
    chunks[currentChunk];





    function copyText(text:string){


        navigator.clipboard.writeText(text);


        setCopied(true);



        setTimeout(()=>{

            setCopied(false);

        },2000);


    }





    function copyCurrentChunk(){


        if(!chunk)
            return;



        const header =

`
Book: ${filename}

Chunk:
${currentChunk+1}/${chunks.length}

Words:
${chunk.words}

----------------------------

`;



        copyText(

            header + chunk.text

        );


    }







    function nextChunk(){


        setCurrentChunk(prev=>{


            if(prev>=chunks.length-1)

                return prev;


            return prev+1;

        });


    }





    function previousChunk(){


        setCurrentChunk(prev=>{


            if(prev<=0)

                return 0;


            return prev-1;

        });


    }







    if(!content){


        return null;


    }






return (


<div

className="
border
rounded-xl
bg-gray-50
p-4
mb-8
"

>



<div

className="
flex
flex-wrap
items-center
justify-between
gap-4
mb-4
"

>



<h3

className="
font-semibold
text-lg
"

>

AI Chunk Manager

</h3>




<ChunkSizeSelector

value={chunkSize}

onChange={(size)=>{

    setChunkSize(size);

    setCurrentChunk(0);

}}

/>



</div>






<ChunkStats

chunk={chunk}

total={chunks.length}

/>





<ChunkProgress

current={currentChunk}

total={chunks.length}

/>







<div

className="
flex
items-center
justify-between
mt-5
gap-3
"

>




<button

onClick={previousChunk}

disabled={currentChunk===0}

className="
flex
items-center
gap-1
px-3
py-2
rounded-lg
border
bg-white
disabled:opacity-40
"

>


<ChevronLeft size={16}/>

Previous


</button>








<button

onClick={copyCurrentChunk}

className="
flex
items-center
gap-2
px-4
py-2
rounded-lg
bg-blue-600
text-white
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

onClick={nextChunk}

disabled={
currentChunk>=chunks.length-1
}

className="
flex
items-center
gap-1
px-3
py-2
rounded-lg
border
bg-white
disabled:opacity-40
"

>


Next

<ChevronRight size={16}/>


</button>





</div>







</div>



);


}