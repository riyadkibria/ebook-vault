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
        nodes.map((node) => (

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
    path: string
  ) => void;

  selectedFile?: string | null;

}





function TreeItem({

  node,

  onFileSelect,

  selectedFile,

}: TreeItemProps) {


  const [open, setOpen] = useState(false);



  const isSelected =
    selectedFile === node.path;



  const hasChildren =
    node.children &&
    node.children.length > 0;



  function handleClick() {


    if (node.type === "folder") {

      setOpen((prev) => !prev);

    } else {

      onFileSelect(node.path);

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

          rounded-lg

          px-2

          py-1.5

          text-left

          transition

          duration-200


          ${
            isSelected

            ? "bg-blue-50 text-blue-700 font-medium"

            : "text-gray-700 hover:bg-gray-100"

          }

        `}

      >


        {
          node.type === "folder"

          ? (

              open

              ? (

                <ChevronDown
                  size={15}
                  className="shrink-0"
                />

              )

              : (

                <ChevronRight
                  size={15}
                  className="shrink-0"
                />

              )

          )

          : (

              <span className="w-[15px]" />

          )

        }




        {

          node.type === "folder"

          ? (

              open

              ? (

                <FolderOpen
                  size={16}
                  className="shrink-0 text-blue-500"
                />

              )

              : (

                <Folder
                  size={16}
                  className="shrink-0 text-blue-500"
                />

              )

          )

          : (

              <FileText
                size={16}
                className="shrink-0 text-gray-400"
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

        && hasChildren

        && (

          <div

            className="

              ml-4

              border-l

              border-gray-200

              pl-2

            "

          >

            {

              node.children!.map((child) => (

                <TreeItem

                  key={child.path}

                  node={child}

                  onFileSelect={onFileSelect}

                  selectedFile={selectedFile}

                />

              ))

            }


          </div>

        )

      }


    </div>

  );

}