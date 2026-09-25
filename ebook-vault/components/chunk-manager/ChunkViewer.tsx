"use client";


import {
 useMemo,
 useState
} from "react";


import {
 splitIntoChunks
} from "@/lib/chunk";


import ChunkManager from "./ChunkManager";

import ChunkReader from "./ChunkReader";



interface Props{

 content:string;

 filename?:string;

}



export default function ChunkViewer({

content,

filename

}:Props){



const [chunkSize,setChunkSize]
=
useState(500);



const chunks = useMemo(()=>{

 return splitIntoChunks(
    content,
    chunkSize
 );

},[
content,
chunkSize
]);



const [current,setCurrent]
=
useState(0);



const chunk = chunks[current];



function next(){

 if(current < chunks.length-1){

    setCurrent(
      current+1
    );

 }

}



function previous(){

 if(current > 0){

    setCurrent(
      current-1
    );

 }

}



if(!chunk){

 return null;

}



return (

<div>


<ChunkManager

filename={filename}

chunk={chunk}

current={current}

total={chunks.length}

chunkSize={chunkSize}

setChunkSize={(value)=>{

 setChunkSize(value);

 setCurrent(0);

}}

next={next}

previous={previous}

/>



<ChunkReader

chunk={chunk}

/>



</div>

);


}