import type {Chunk} from "@/lib/chunk";


interface Props{

chunk:Chunk;

}



export default function ChunkReader({

chunk

}:Props){


return (

<article

className="
mx-auto
max-w-4xl
rounded-2xl
border
bg-white
p-8
shadow-sm
sm:p-12
"

>


<div

className="
prose
prose-slate
max-w-none
"

>

{

chunk.text
.split("\n\n")
.map((item,index)=>(

<p key={index}>

{item}

</p>

))

}


</div>


</article>

);


}