"use client";

import { useState } from "react";
import type { TreeNode } from "@/lib/buildTree";

import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  BookOpen,
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

      const updated = new Set(prev);


      if(updated.has(path)){
        updated.delete(path);
      }
      else{
        updated.add(path);
      }


      return updated;

    });

  }





  function renderTree(
    nodes:TreeNode[],
    level=0
  ){


    return nodes.map(node=>{


      const folder =
        node.type === "folder";


      const opened =
        openFolders.has(node.path);



      const selected =
        selectedFile === node.path;



      return (

        <div
          key={node.path}
        >


          <div

            onClick={()=>{


              if(folder){

                toggleFolder(
                  node.path
                );

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
              h-9
              rounded-lg
              px-2
              cursor-pointer
              transition-all
              duration-200
              text-sm

              ${
                selected

                ?

                "bg-blue-50 text-blue-700"

                :

                "text-gray-700 hover:bg-gray-100"

              }

            `}


            style={{
              paddingLeft:
              `${level * 20 + 8}px`
            }}

          >



            {/* Arrow */}

            <span
              className="
              w-5
              flex
              justify-center
              items-center
              "
            >

            {
              folder

              ?

              (
                opened

                ?

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                />

                :

                <ChevronRight
                  size={16}
                  strokeWidth={2}
                />

              )

              :

              null
            }

            </span>



            {/* Icon */}

            <span
              className="
              w-5
              flex
              justify-center
              items-center
              mr-2
              "
            >

            {
              folder

              ?

              <Folder
                size={16}
                strokeWidth={2}
                className="text-amber-500"
              />

              :

              <FileText
                size={16}
                strokeWidth={2}
                className="text-blue-500"
              />

            }

            </span>




            <span
              className="
              truncate
              "
            >

              {node.name}

            </span>



          </div>





          {
            folder &&
            opened &&
            node.children &&

            (

              <div>

                {
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

    <main
      className="
      flex
      h-screen
      bg-gray-50
      text-gray-900
      "
    >



      {/* SIDEBAR */}


      <aside

        className="
        w-[340px]
        bg-white
        border-r
        border-gray-200
        p-5
        overflow-y-auto
        shadow-sm
        "

      >


        <div
          className="
          flex
          items-center
          gap-3
          mb-8
          "
        >

          <div
            className="
            p-2
            rounded-xl
            bg-blue-50
            "
          >

            <BookOpen
              size={22}
              className="text-blue-600"
            />

          </div>


          <h1
            className="
            font-semibold
            text-xl
            "
          >

            Ebook Vault

          </h1>


        </div>



        <p
          className="
          text-xs
          uppercase
          tracking-wider
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
        p-10
        overflow-y-auto
        "

      >


        {

          selectedFile

          ?

          (

          <div>


            <h2
              className="
              text-2xl
              font-semibold
              text-gray-800
              border-b
              pb-5
              mb-8
              "
            >

              {selectedFile}

            </h2>



            <div
              className="
              text-gray-600
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
            text-gray-400
            "
          >

            <div
              className="
              text-center
              "
            >

              <BookOpen
                size={48}
                className="
                mx-auto
                mb-4
                opacity-30
                "
              />


              <p>
                Select a chapter to read
              </p>


            </div>


          </div>

          )


        }


      </section>



    </main>

  );

}