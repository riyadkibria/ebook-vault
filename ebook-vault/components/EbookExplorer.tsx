"use client";

import { useState } from "react";
import type { TreeNode } from "@/lib/buildTree";

import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  BookOpen,
  Menu,
  X,
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


  const [mobileOpen,setMobileOpen] =
    useState(false);




  function toggleFolder(path:string){

    setOpenFolders(prev=>{

      const next = new Set(prev);


      next.has(path)
      ?
      next.delete(path)
      :
      next.add(path);


      return next;

    });

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

        <div key={node.path}>


          <div

          onClick={()=>{


            if(folder){

              toggleFolder(node.path);

            }
            else{

              setSelectedFile(node.path);

              setMobileOpen(false);

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


          <span className="w-5">

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



          <span className="w-6">

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


{/* MOBILE BUTTON */}


<button

onClick={()=>setMobileOpen(true)}

className="
md:hidden
fixed
top-4
left-4
z-50
bg-white
shadow-lg
rounded-full
p-3
border
"

>

<Menu size={22}/>

</button>





{/* OVERLAY */}


{
mobileOpen &&

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

<h2
className="
text-xl
md:text-2xl
font-semibold
"
>

{selectedFile}

</h2>

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
className="mx-auto mb-4 opacity-30"
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