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
        space-y-0.5
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

          group

          flex

          w-full

          items-center

          gap-2

          rounded-lg

          px-2

          py-1.5

          text-left

          transition-all

          duration-150


          ${
            isSelected

            ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20"

            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"

          }

        `}

      >


        {
          node.type === "folder"

          ? (

              open

              ? (

                <ChevronDown
                  size={14}
                  className={`
                    shrink-0
                    transition-colors
                    ${isSelected ? "text-white/70" : "text-slate-400"}
                  `}
                />

              )

              : (

                <ChevronRight
                  size={14}
                  className={`
                    shrink-0
                    transition-colors
                    ${isSelected ? "text-white/70" : "text-slate-400"}
                  `}
                />

              )

          )

          : (

              <span className="w-[14px] shrink-0" />

          )

        }




        {

          node.type === "folder"

          ? (

              open

              ? (

                <FolderOpen
                  size={16}
                  className={`
                    shrink-0
                    ${isSelected ? "text-amber-300" : "text-amber-500"}
                  `}
                />

              )

              : (

                <Folder
                  size={16}
                  className={`
                    shrink-0
                    ${isSelected ? "text-amber-300" : "text-amber-500"}
                  `}
                />

              )

          )

          : (

              <FileText
                size={15}
                className={`
                  shrink-0
                  ${isSelected ? "text-white/70" : "text-slate-400"}
                `}
              />

          )

        }





        <span
          className={`
            truncate
            ${isSelected ? "font-medium" : "font-normal"}
          `}
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

              ml-[10px]

              border-l

              border-slate-200/80

              pl-3

              mt-0.5

              space-y-0.5

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