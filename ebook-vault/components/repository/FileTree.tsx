"use client";


import {
  useState,
} from "react";


import {
  TreeNode,
} from "@/lib/buildTree";





interface Props {

  nodes: TreeNode[];

  onFileSelect: (
    path:string
  ) => void;

}






export default function FileTree({

  nodes,

  onFileSelect,

}: Props) {



  return (

    <div
      className="
        space-y-1
      "
    >


      {
        nodes.map((node)=>(

          <TreeItem

            key={node.path}

            node={node}

            onFileSelect={
              onFileSelect
            }

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

}





function TreeItem({

  node,

  onFileSelect,

}: TreeItemProps) {



  const [

    open,

    setOpen,

  ] = useState(false);





  function handleClick(){



    if(node.type === "folder"){


      setOpen(!open);


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

        className="
          flex
          w-full
          items-center
          gap-2
          rounded-md
          px-3
          py-2
          text-left
          hover:bg-gray-100
        "

      >


        <span>

          {
            node.type === "folder"

            ? open
              ? "📂"
              : "📁"

            : "📄"
          }

        </span>



        <span>

          {node.name}

        </span>


      </button>





      {
        node.type === "folder"
        &&
        open
        &&
        node.children
        &&
        (

          <div
            className="
              ml-5
              border-l
              pl-2
            "
          >


            {
              node.children.map(
                child=>(


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