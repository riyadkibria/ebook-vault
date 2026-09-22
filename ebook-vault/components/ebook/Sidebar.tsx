"use client";


import {

  ChevronDown,

  ChevronRight,

  Folder,

  FileText,

  BookOpen,

  X,

  Circle,

  CheckCircle2,

} from "lucide-react";


import type {
  TreeNode
} from "@/lib/buildTree";


import {
  useReadingStatus
} from "./hooks/useReadingStatus";




interface Props {


  tree: TreeNode[];


  openFolders: Set<string>;


  selectedFile:string;



  toggleFolder:(

    path:string

  )=>void;



  openFile:(

    path:string

  )=>void;



  mobileOpen?:boolean;



  closeMobile?:()=>void;


}





export default function Sidebar({

  tree,

  openFolders,

  selectedFile,

  toggleFolder,

  openFile,

  mobileOpen=false,

  closeMobile,

}:Props){



  const {

    getStatus,

    updateStatus,

  } = useReadingStatus();







  function handleOpenFile(

    path:string

  ){


    openFile(path);



    updateStatus(

      path,

      "reading"

    );


  }







  function renderStatus(

    path:string

  ){


    const status =
      getStatus(path);




    if(status==="completed"){

      return (

        <CheckCircle2

          size={15}

          className="
            text-green-500
            ml-auto
          "

        />

      );

    }





    if(status==="reading"){


      return (

        <span

          className="
            ml-auto
            h-2
            w-2
            rounded-full
            bg-blue-500
          "

        />

      );


    }




    return (

      <Circle

        size={13}

        className="
          text-gray-300
          ml-auto
        "

      />

    );


  }








  function renderTree(

    nodes:TreeNode[],

    level=0

  ){


    return nodes.map(node=>{


      const isFolder =
        node.type==="folder";


      const opened =
        openFolders.has(
          node.path
        );



      const selected =
        selectedFile===node.path;





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

              flex

              w-full

              items-center

              gap-2

              rounded-xl

              py-2

              pr-3

              text-sm

              transition


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

              `${level*18+10}px`

            }}



          >




            <span

              className="
                flex
                w-5
                justify-center
              "

            >


              {


                isFolder &&

                (

                  opened

                  ?

                  <ChevronDown size={16}/>

                  :

                  <ChevronRight size={16}/>

                )


              }


            </span>







            {


              isFolder


              ?


              <Folder


                size={17}

                className="
                  text-amber-500
                "


              />


              :


              <FileText


                size={17}

                className="
                  text-blue-500
                "


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

              level+1

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

        bg-white

        p-5

        shadow-xl

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

          <BookOpen

            size={26}

            className="
              text-blue-600
            "

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






        {


          closeMobile &&

          (

            <button

              onClick={closeMobile}

              className="
                rounded-lg
                p-2
                hover:bg-gray-100
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
          text-xs
          uppercase
          tracking-wider
          text-gray-400
        "

      >

        Library

      </p>







      <div

        className="
          space-y-1
        "

      >


        {

          renderTree(tree)

        }


      </div>





    </aside>


  );

}