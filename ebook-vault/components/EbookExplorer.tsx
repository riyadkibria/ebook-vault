"use client";

import { useState } from "react";
import type { TreeNode } from "@/lib/buildTree";


export default function EbookExplorer({
  tree,
}: {
  tree: TreeNode[];
}) {


  const [openFolders, setOpenFolders] = useState<
    Set<string>
  >(new Set());


  const [selectedFile, setSelectedFile] =
    useState("");



  function toggleFolder(path:string){

    setOpenFolders(prev => {

      const newSet = new Set(prev);


      if(newSet.has(path)){

        newSet.delete(path);

      }else{

        newSet.add(path);

      }


      return newSet;

    });

  }




  function renderTree(
    nodes:TreeNode[],
    level=0
  ){


    return nodes.map(node => {


      const isOpen =
        openFolders.has(node.path);



      return (

        <div key={node.path}>


          <div

            className="
              cursor-pointer
              hover:bg-gray-100
              rounded
              p-1
            "

            style={{
              paddingLeft:
              `${level * 20}px`
            }}


            onClick={()=>{


              if(node.type==="folder"){

                toggleFolder(node.path);

              }


              if(node.type==="file"){

                setSelectedFile(
                  node.path
                );

              }


            }}

          >


            {
              node.type==="folder"

              ?

              (
                isOpen
                ?
                "📂"
                :
                "📁"
              )

              :

              "📄"
            }


            {" "}

            {node.name}


          </div>




          {
            node.children &&
            isOpen &&
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

    <main className="flex h-screen">


      {/* LEFT */}

      <aside
        className="
        w-1/3
        border-r
        p-4
        overflow-auto
        "
      >

        <h1 className="text-xl font-bold mb-5">
          📚 Ebook Library
        </h1>


        {
          renderTree(tree)
        }


      </aside>



      {/* RIGHT */}


      <section className="flex-1 p-8">


        {
          selectedFile

          ?

          <div>

            <h2 className="text-xl font-bold">
              {selectedFile}
            </h2>


            <p className="mt-5">
              Markdown content loading soon...
            </p>


          </div>


          :

          <h2>
            Select a markdown file
          </h2>

        }


      </section>


    </main>

  );

}