"use client";

import { useState } from "react";
import type { TreeNode } from "@/lib/buildTree";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  BookOpen
} from "lucide-react";


export default function EbookExplorer({
  tree,
}: {
  tree: TreeNode[];
}) {


  const [openFolders, setOpenFolders] =
    useState<Set<string>>(new Set());


  const [selectedFile, setSelectedFile] =
    useState("");



  function toggleFolder(path:string){

    setOpenFolders(prev => {

      const next = new Set(prev);


      if(next.has(path)){

        next.delete(path);

      }else{

        next.add(path);

      }


      return next;

    });

  }



  function renderTree(
    nodes:TreeNode[],
    level=0
  ){


    return nodes.map(node=>{


      const isFolder =
        node.type==="folder";


      const isOpen =
        openFolders.has(node.path);



      const isSelected =
        selectedFile === node.path;



      return (

        <div key={node.path}>


          <div

            onClick={()=>{


              if(isFolder){

                toggleFolder(node.path);

              }
              else{

                setSelectedFile(
                  node.path
                );

              }


            }}


            className={`
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              cursor-pointer
              transition-all
              duration-200

              ${
                isSelected
                ?
                "bg-blue-500/20 text-blue-400"
                :
                "text-gray-300 hover:bg-white/10"
              }

            `}


            style={{
              marginLeft:
              `${level * 18}px`
            }}

          >


            {
              isFolder

              ?

              (
                isOpen
                ?
                <ChevronDown size={16}/>
                :
                <ChevronRight size={16}/>
              )

              :

              <span className="w-4"/>
            }



            {
              isFolder

              ?

              <Folder
                size={17}
                className="text-yellow-400"
              />

              :

              <FileText
                size={17}
                className="text-blue-400"
              />

            }



            <span
              className="
              text-sm
              truncate
              "
            >
              {node.name}
            </span>


          </div>




          {
            isFolder &&
            isOpen &&

            (

              <div
                className="
                animate-in
                fade-in
                slide-in-from-top-2
                duration-200
                "
              >

                {
                  node.children &&
                  renderTree(
                    node.children,
                    level+1
                  )
                }

              </div>

            )

          }



        </div>

      );


    });


  }




return (

<div
className="
flex
h-screen
bg-[#0f1117]
text-white
overflow-hidden
"
>


{/* SIDEBAR */}


<aside

className="
w-[360px]
border-r
border-white/10
bg-[#111318]
p-5
overflow-y-auto
"

>


<div
className="
flex
items-center
gap-3
mb-6
"
>

<BookOpen
size={25}
className="text-blue-400"
/>


<h1
className="
text-xl
font-semibold
"
>
Ebook Vault
</h1>


</div>



<div
className="
text-xs
uppercase
tracking-wider
text-gray-500
mb-3
"
>

Library

</div>



{

renderTree(tree)

}


</aside>





{/* READER */}


<section

className="
flex-1
bg-[#0b0d12]
p-10
overflow-auto
"

>


{

selectedFile

?

(

<div>


<div
className="
border-b
border-white/10
pb-5
mb-8
"
>


<h2
className="
text-2xl
font-semibold
"
>

{selectedFile}

</h2>


</div>



<div
className="
text-gray-400
leading-8
"
>

Markdown content will appear here...

</div>


</div>

)


:

(

<div
className="
h-full
flex
items-center
justify-center
text-gray-500
"
>

<div
className="text-center"
>

<BookOpen
size={50}
className="
mx-auto
mb-4
opacity-40
"
/>


<p>
Select a chapter to start reading
</p>


</div>


</div>

)


}


</section>



</div>

);


}