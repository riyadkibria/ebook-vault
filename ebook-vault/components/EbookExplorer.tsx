"use client";

import { useRef, useState } from "react";
import type { TreeNode } from "@/lib/buildTree";

import ReactMarkdown from "react-markdown";

import { getFileContent } from "@/lib/github";

import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  BookOpen,
  Menu,
  X,
  Copy,
  Check,
} from "lucide-react";



export default function EbookExplorer({
  tree,
}: {
  tree: TreeNode[];
}) {


  const [openFolders,setOpenFolders] =
    useState<Set<string>>(new Set());


  const [selectedFile,setSelectedFile] =
    useState("");


  const [content,setContent] =
    useState("");


  const [loading,setLoading] =
    useState(false);


  const [mobileOpen,setMobileOpen] =
    useState(false);


  const [copied,setCopied] =
    useState(false);





  // Floating button position

  const [menuPosition,setMenuPosition] =
    useState({
      x:16,
      y:16,
    });



  const dragging =
    useRef(false);


  const dragOffset =
    useRef({
      x:0,
      y:0,
    });





  function startDrag(
    e:React.TouchEvent<HTMLButtonElement>
  ){

    dragging.current = true;


    dragOffset.current = {

      x:
      e.touches[0].clientX -
      menuPosition.x,


      y:
      e.touches[0].clientY -
      menuPosition.y,

    };

  }





  function moveDrag(
    e:React.TouchEvent<HTMLButtonElement>
  ){

    if(!dragging.current)
      return;


    setMenuPosition({

      x:
      e.touches[0].clientX -
      dragOffset.current.x,


      y:
      e.touches[0].clientY -
      dragOffset.current.y,

    });

  }





  function stopDrag(){

    dragging.current=false;

  }






  function toggleFolder(path:string){

    setOpenFolders(prev=>{

      const next =
      new Set(prev);


      if(next.has(path)){

        next.delete(path);

      }
      else{

        next.add(path);

      }


      return next;

    });

  }







  async function openFile(path:string){

    setSelectedFile(path);

    setMobileOpen(false);

    setLoading(true);


    const markdown =
    await getFileContent(path);


    setContent(markdown);

    setLoading(false);

  }






  async function copyMarkdown(){


    if(!content)
      return;


    await navigator.clipboard.writeText(
      content
    );


    setCopied(true);


    setTimeout(()=>{

      setCopied(false);

    },2000);

  }







  function renderTree(
    nodes:TreeNode[],
    level=0
  ){


    return nodes.map(node=>{


      const folder =
      node.type==="folder";


      const opened =
      openFolders.has(node.path);



      const selected =
      selectedFile===node.path;



      return (

        <div
        key={node.path}
        >


          <div


          onClick={()=>{


            if(folder){

              toggleFolder(node.path);

            }

            else{

              openFile(node.path);

            }


          }}



          className={`

          flex
          items-center
          h-10
          rounded-lg
          cursor-pointer
          transition
          px-2
          text-sm


          ${
            selected

            ?

            "bg-blue-50 text-blue-700"

            :

            "hover:bg-gray-100 text-gray-700"

          }

          `}



          style={{

            paddingLeft:
            `${level*18+8}px`

          }}



          >



          <span
          className="
          w-5
          flex
          justify-center
          "
          >

          {

          folder &&

          (

          opened

          ?

          <ChevronDown size={16}/>

          :

          <ChevronRight size={16}/>

          )

          }

          </span>





          <span
          className="
          w-6
          flex
          justify-center
          "
          >


          {

          folder

          ?

          <Folder
          size={17}
          className="text-amber-500"
          />

          :

          <FileText
          size={17}
          className="text-blue-500"
          />

          }


          </span>





          <span className="truncate">

          {node.name}

          </span>




          </div>






          {

          folder &&
          opened &&
          node.children &&


          renderTree(
            node.children,
            level+1
          )


          }



        </div>

      );


    });


  }









return (

<main

className="
flex
h-screen
bg-gray-50
overflow-hidden
"

>





{/* FLOATING MOBILE MENU */}


<button


onClick={()=>setMobileOpen(true)}


onTouchStart={startDrag}

onTouchMove={moveDrag}

onTouchEnd={stopDrag}



style={{

left:menuPosition.x,

top:menuPosition.y,

}}



className="
md:hidden
fixed
z-50
w-9
h-9
rounded-full
bg-white/60
backdrop-blur-md
border
border-gray-200
shadow-md
flex
items-center
justify-center
active:scale-90
transition
"

>


<Menu size={16}/>


</button>









{mobileOpen &&

<div

onClick={()=>setMobileOpen(false)}

className="
fixed
inset-0
bg-black/30
z-40
md:hidden
"

/>

}








{/* SIDEBAR */}


<aside


className={`

fixed
md:static
z-50
h-full
w-[320px]
bg-white
border-r
shadow-xl
p-5
overflow-y-auto

transition-transform
duration-300


${

mobileOpen

?

"translate-x-0"

:

"-translate-x-full md:translate-x-0"

}


`}


>


<div

className="
flex
items-center
justify-between
mb-8
"

>


<div

className="
flex
gap-3
items-center
"

>

<BookOpen
size={24}
className="text-blue-600"
/>


<h1

className="
font-semibold
text-xl
"

>

Ebook Vault

</h1>


</div>



<button

className="md:hidden"

onClick={()=>setMobileOpen(false)}

>

<X size={22}/>


</button>



</div>






<p

className="
text-xs
uppercase
text-gray-400
mb-3
"

>

Library

</p>



{
renderTree(tree)
}




</aside>









{/* READER */}



<section

className="
flex-1
bg-white
p-6
md:p-10
overflow-y-auto
"

>


{

selectedFile


?


<div>


<div

className="
flex
items-center
justify-between
gap-4
mb-8
border-b
pb-4
"

>


<h2

className="
text-xl
md:text-2xl
font-semibold
truncate
"

>

{selectedFile}

</h2>




<button


onClick={copyMarkdown}


disabled={!content}


className="
flex
items-center
gap-2
px-3
py-2
rounded-lg
border
bg-gray-50
hover:bg-gray-100
text-sm
transition
disabled:opacity-40
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

Copy

</>


}



</button>



</div>






{

loading


?


<p className="text-gray-400">

Loading...

</p>



:


<div

className="
prose
max-w-none
prose-headings:text-gray-900
prose-p:text-gray-700
"

>


<ReactMarkdown>

{content}

</ReactMarkdown>


</div>


}



</div>



:


<div

className="
h-full
flex
items-center
justify-center
text-gray-400
"

>


<div className="text-center">


<BookOpen

size={45}

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



}



</section>






</main>

);

}