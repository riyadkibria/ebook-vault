"use client";

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  BookOpen,
  X,
} from "lucide-react";

import type { TreeNode } from "@/lib/buildTree";

import { useReadingStatus } from "./hooks/useReadingStatus";


interface Props {

  tree: TreeNode[];

  openFolders: Set<string>;

  selectedFile: string;

  toggleFolder: (
    path:string
  ) => void;

  openFile: (
    path:string
  ) => void;

  mobileOpen?: boolean;

  closeMobile?: () => void;

}



export default function Sidebar({

  tree,

  openFolders,

  selectedFile,

  toggleFolder,

  openFile,

  mobileOpen = false,

  closeMobile,

}: Props){



  const {
    getStatus,
    toggleStatus,
  } = useReadingStatus();





  function handleOpenFile(
    path:string
  ){

    openFile(path);

  }







  function renderStatus(
    path:string
  ){

    const status = getStatus(path);


    return (

      <button

        onClick={(e)=>{

          e.stopPropagation();

          toggleStatus(path);

        }}

        className="ml-auto shrink-0"

        title={
          status
          ? "Remove marker"
          : "Mark as reading"
        }

      >

        <span

          className={`
            block
            h-2.5
            w-2.5
            rounded-full
            transition

            ${
              status === "reading"
              ? "bg-blue-500 ring-2 ring-blue-100"
              : "border border-slate-300 bg-white group-hover:border-slate-400"
            }
          `}

        />

      </button>

    );

  }









  function renderTree(

    nodes:TreeNode[],

    level=0

  ){


    return nodes.map(node=>{


      const isFolder =
        node.type === "folder";


      const opened =
        openFolders.has(node.path);



      const selected =
        selectedFile === node.path;





      return (

        <div
          key={node.path}
        >


          <button


            onClick={()=>{


              if(isFolder){

                toggleFolder(
                  node.path
                );

              }

              else{

                handleOpenFile(
                  node.path
                );

              }


            }}


            className={`
              group
              relative
              flex
              w-full
              items-center
              gap-2
              rounded-lg
              py-2
              pr-3
              text-sm
              transition-colors
              duration-150

              ${
                selected
                ? "bg-blue-50/80 text-blue-700 font-medium"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }
            `}



            style={{

              paddingLeft:
                `${level * 18 + 10}px`

            }}



          >




            {
              selected && (

                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    h-4
                    w-[3px]
                    -translate-y-1/2
                    rounded-full
                    bg-blue-600
                  "
                />

              )
            }




            <span
              className="
                flex
                w-5
                shrink-0
                justify-center
                text-slate-400
              "
            >

              {
                isFolder && (

                  opened

                  ?

                  <ChevronDown size={15}/>

                  :

                  <ChevronRight size={15}/>

                )
              }

            </span>





            {
              isFolder

              ?

              <Folder

                size={16}

                strokeWidth={1.75}

                className="shrink-0 text-amber-400/90"

              />

              :

              <FileText

                size={16}

                strokeWidth={1.75}

                className={`
                  shrink-0

                  ${
                    selected
                    ? "text-blue-600"
                    : "text-slate-400"
                  }
                `}

              />

            }





            <span
              className="
                truncate
                text-left
              "
            >

              {node.name}

            </span>






            {
              !isFolder &&

              renderStatus(
                node.path
              )
            }




          </button>







          {

            isFolder &&

            opened &&

            node.children &&


            renderTree(

              node.children,

              level + 1

            )

          }





        </div>

      );

    });


  }









  return (

    <aside


      className={`

        fixed

        md:static

        inset-y-0

        left-0

        z-50

        w-[320px]

        overflow-y-auto

        border-r

        border-slate-200

        bg-white

        p-5

        shadow-2xl

        shadow-slate-900/10

        transition-transform

        duration-300

        ease-out

        md:shadow-none


        ${
          mobileOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
        }

      `}


    >





      <div

        className="
          mb-8
          flex
          items-center
          justify-between
        "

      >



        <div

          className="
            flex
            items-center
            gap-3
          "

        >

          <div

            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-blue-50
            "

          >

            <BookOpen

              size={20}

              strokeWidth={2}

              className="text-blue-600"

            />

          </div>



          <h1

            className="
              text-lg
              font-semibold
              tracking-tight
              text-slate-900
            "

          >

            Ebook Vault

          </h1>


        </div>






        {

          closeMobile && (

            <button

              onClick={closeMobile}

              className="
                rounded-lg
                p-2
                text-slate-400
                transition-colors
                hover:bg-slate-100
                hover:text-slate-600
                md:hidden
              "

            >

              <X size={20}/>

            </button>

          )

        }





      </div>








      <p

        className="
          mb-3
          px-1
          text-xs
          font-medium
          text-slate-400
        "

      >

        Library

      </p>







      <div

        className="
          space-y-0.5
        "

      >

        {
          renderTree(tree)
        }

      </div>





    </aside>

  );

}