"use client";


import {
  useEffect,
  useState
} from "react";


import {
  Copy,
  Check
} from "lucide-react";


import {
  supabase
} from "@/lib/supabase";





interface CopiedChunk {


  id:number;

  book_name:string;

  chunk_id:string;

  chunk_number:number;

  total_chunks:number;

  words:number;

  estimated_tokens:number;

  content:string;

  copy_count:number;

  created_at:string;

}







export default function CopiedChunksPage(){


  const [
    chunks,
    setChunks
  ] = useState<CopiedChunk[]>([]);



  const [
    copied,
    setCopied
  ] = useState(false);






  useEffect(()=>{


    async function load(){



      const {
        data,
        error

      } = await supabase


        .from("copied_chunks")


        .select("*")


        .order(
          "created_at",
          {
            ascending:false
          }
        );





      if(error){

        console.error(
          error
        );

        return;

      }




      setChunks(
        data ?? []
      );



    }




    load();



  },[]);









  const markdown = chunks.map((chunk)=>{


return `# ${chunk.book_name}


## Chunk ${chunk.chunk_number}/${chunk.total_chunks}


**Words:** ${chunk.words}


**Tokens:** ${chunk.estimated_tokens}


**Times Copied:** ${chunk.copy_count}



---

${chunk.content}


---

`;



  }).join("\n");








  async function copyMarkdown(){



    await navigator.clipboard.writeText(
      markdown
    );



    setCopied(true);



    setTimeout(()=>{

      setCopied(false);

    },1500);



  }








return (


<div

className="
mx-auto
max-w-5xl
p-6
"

>



<div

className="
mb-6
flex
items-center
justify-between
"

>


<h1

className="
text-3xl
font-bold
text-slate-900
"

>

Copied Knowledge

</h1>





<button

onClick={copyMarkdown}

className="
flex
items-center
gap-2
rounded-xl
bg-blue-600
px-5
py-3
text-white
shadow
hover:bg-blue-700
"

>


{

copied

?


<>

<Check size={18}/>

Copied

</>


:

<>

<Copy size={18}/>

Copy Markdown

</>



}



</button>



</div>









<pre

className="
overflow-x-auto
rounded-xl
border
bg-slate-50
p-6
text-sm
leading-7
text-slate-700
"

>


{markdown}



</pre>





</div>


);



}