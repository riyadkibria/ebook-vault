// ===========================================================
// File: components/repository/FileTree.tsx
// ===========================================================


"use client";


import {
  useState,
} from "react";


import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
} from "lucide-react";


import {
  TreeNode,
} from "@/lib/buildTree";







interface Props {

  nodes: TreeNode[];

  onFileSelect: (
    path: string
  ) => void;

  selectedFile?: string | null;

}







export default function FileTree({

  nodes,

  onFileSelect,

  selectedFile,

}: Props) {



  return (



    <div

      className="
        space-y-1
        text-sm
      "

    >



      {
        nodes.map((node)=>(


          <TreeItem

            key={node.path}

            node={node}

            onFileSelect={onFileSelect}

            selectedFile={selectedFile}

          />


        ))
      }





    </div>



  );

}








interface TreeItemProps {

  node: TreeNode;

  onFileSelect: (
    path:string
  ) => void;

  selectedFile?: string | null;

}








function TreeItem({

  node,

  onFileSelect,

  selectedFile,

}: TreeItemProps) {




  const [

    open,

    setOpen,

  ] = useState(false);






  const isSelected =
    selectedFile === node.path;








  function handleClick() {



    if(node.type === "folder"){


      setOpen(
        previous => !previous
      );


    }

    else {


      onFileSelect(
        node.path
      );


    }


  }









  return (



    <div>



      <button

        onClick={handleClick}

        className={`
          flex
          w-full
          items-center
          gap-2
          rounded-md
          px-2
          py-1.5
          text-left
          transition

          ${
            isSelected
            ? "bg-blue-50 text-blue-700"
            : "hover:bg-gray-100"
          }
        `}

      >



        {
          node.type === "folder"
          ? (

            open

            ? <ChevronDown
                size={16}
              />

            : <ChevronRight
                size={16}
              />

          )

          : (

            <span className="w-4" />

          )
        }







        {
          node.type === "folder"

          ? (

              open

              ? <FolderOpen
                  size={17}
                />

              : <Folder
                  size={17}
                />

            )

          : (

              <FileText
                size={17}
              />

            )
        }







        <span

          className="
            truncate
          "

        >

          {node.name}


        </span>





      </button>









      {
        node.type === "folder"

        && open

        && node.children

        && (

          <div

            className="
              ml-5
              border-l
              border-gray-200
              pl-2
            "

          >





            {
              node.children.map(
                child => (


                  <TreeItem

                    key={
                      child.path
                    }

                    node={
                      child
                    }

                    onFileSelect={
                      onFileSelect
                    }

                    selectedFile={
                      selectedFile
                    }


                  />


                )

              )
            }





          </div>


        )

      }





    </div>



  );

}