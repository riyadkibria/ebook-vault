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



const [current,setCurrent]
=
useState(0);



const [copied,setCopied]
=
useState(false);





const chunks =
useMemo(()=>


splitIntoChunks(

content,

chunkSize

)


,[content,chunkSize]);





const chunk =
chunks[current];





if(!chunk)

return null;







async function copyChunk(){


const text=

`
Book: ${filename}

Chunk ${current+1}/${chunks.length}

${chunk.text}
`;



await navigator.clipboard.writeText(text);



setCopied(true);


setTimeout(()=>{

setCopied(false)

},1500);



}






const progress =
Math.round(

((current+1)/chunks.length)*100

);






return (

<div

className="
sticky
top-0
z-20
mb-6
rounded-xl
border
bg-white/90
backdrop-blur
shadow-sm
p-3
"

>



<div

className="
flex
flex-wrap
items-center
justify-between
gap-3
"

>



<div

className="
flex
items-center
gap-3
text-sm
"

>


<span

className="
font-semibold
"

>

AI Chunk

</span>



<span className="text-gray-500">

{current+1}/{chunks.length}

</span>



<span className="text-gray-500">

{chunk.words} words

</span>



<span className="hidden sm:inline text-gray-500">

~{chunk.estimatedTokens} tokens

</span>



</div>







<select


value={chunkSize}


onChange={(e)=>{


setChunkSize(

Number(e.target.value)

);


setCurrent(0);


}}


className="
text-sm
border
rounded-lg
px-2
py-1
bg-white
"

>


<option value={500}>
500
</option>

<option value={1000}>
1000
</option>

<option value={1500}>
1500
</option>

<option value={3000}>
3000
</option>

<option value={5000}>
5000
</option>


</select>



</div>









<div

className="
h-1.5
bg-gray-200
rounded-full
mt-3
overflow-hidden
"

>


<div

className="
h-full
bg-blue-600
transition-all
"

style={{

width:`${progress}%`

}}


/>


</div>









<div

className="
flex
justify-between
items-center
mt-3
"

>



<button

disabled={current===0}

onClick={()=>setCurrent(c=>c-1)}

className="
p-2
rounded-lg
border
disabled:opacity-30
"

>

<ChevronLeft size={18}/>

</button>








<button

onClick={copyChunk}

className="
flex
items-center
gap-2
px-4
py-2
rounded-lg
bg-blue-600
text-white
text-sm
"

>


{

copied

?

<>

<Check size={15}/>

Copied

</>


:

<>

<Copy size={15}/>

Copy Chunk

</>

}


</button>








<button

disabled={current===chunks.length-1}

onClick={()=>setCurrent(c=>c+1)}

className="
p-2
rounded-lg
border
disabled:opacity-30
"

>

<ChevronRight size={18}/>

</button>







</div>





</div>


);



}