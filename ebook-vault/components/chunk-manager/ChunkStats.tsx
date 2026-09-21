"use client";


import type { Chunk } from "@/lib/chunk";



interface Props {

    chunk?:Chunk;

    total:number;

}




export default function ChunkStats({

    chunk,

    total

}:Props){



if(!chunk){

    return null;

}





return (


<div

className="
grid
grid-cols-2
md:grid-cols-4
gap-3
mb-4
"

>





<div

className="
bg-white
border
rounded-lg
p-3
"

>


<p

className="
text-xs
text-gray-400
uppercase
"

>

Words

</p>


<p

className="
font-semibold
text-lg
"

>

{chunk.words.toLocaleString()}

</p>


</div>








<div

className="
bg-white
border
rounded-lg
p-3
"

>


<p

className="
text-xs
text-gray-400
uppercase
"

>

Characters

</p>


<p

className="
font-semibold
text-lg
"

>

{chunk.characters.toLocaleString()}

</p>


</div>








<div

className="
bg-white
border
rounded-lg
p-3
"

>


<p

className="
text-xs
text-gray-400
uppercase
"

>

Estimated Tokens

</p>


<p

className="
font-semibold
text-lg
"

>

~{chunk.estimatedTokens.toLocaleString()}

</p>


</div>








<div

className="
bg-white
border
rounded-lg
p-3
"

>


<p

className="
text-xs
text-gray-400
uppercase
"

>

Chunk

</p>


<p

className="
font-semibold
text-lg
"

>

{chunk.id + 1} / {total}

</p>


</div>





</div>



);


}