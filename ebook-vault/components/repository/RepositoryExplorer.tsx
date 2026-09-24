// ===========================================================
// File: components/repository/RepositoryExplorer.tsx
// ===========================================================

"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import ExplorerSidebar from "./ExplorerSidebar";
import MarkdownReader from "./MarkdownReader";

import {
  buildTree,
  TreeNode,
} from "@/lib/buildTree";



interface Repository {

  id: number;

  name: string;

  fullName: string;

  description: string | null;

  language: string | null;

  stars: number;

  updatedAt: string;

  defaultBranch: string;

  url: string;

}



interface GithubTreeItem {

  path: string;

  type: "blob" | "tree";

}



interface Props {

  repositories: Repository[];

}



export default function RepositoryExplorer({

  repositories,

}: Props) {



  const [

    selectedRepository,

    setSelectedRepository,

  ] = useState<Repository | null>(null);



  const [

    tree,

    setTree,

  ] = useState<TreeNode[]>([]);



  const [

    treeLoading,

    setTreeLoading,

  ] = useState(false);



  const [

    selectedFile,

    setSelectedFile,

  ] = useState<string | null>(null);



  const [

    markdown,

    setMarkdown,

  ] = useState("");



  const [

    markdownLoading,

    setMarkdownLoading,

  ] = useState(false);



  const [

    mobileSidebarOpen,

    setMobileSidebarOpen,

  ] = useState(false);






  // =======================================
  // Load Repository Tree
  // =======================================


  useEffect(() => {


    if (!selectedRepository) {

      setTree([]);

      setSelectedFile(null);

      setMarkdown("");

      return;

    }



    const repo = selectedRepository;



    async function loadTree() {


      try {


        setTreeLoading(true);


        const response = await fetch(

          `/api/github/tree?repo=${repo.name}&branch=${repo.defaultBranch}`

        );



        if (!response.ok) {

          throw new Error(
            "Failed to load repository tree"
          );

        }



        const data: GithubTreeItem[] =

          await response.json();



        setTree(

          buildTree(data)

        );



      } catch(error) {


        console.error(

          "Tree error:",

          error

        );


        setTree([]);



      } finally {


        setTreeLoading(false);


      }


    }



    loadTree();



  }, [selectedRepository]);







  // =======================================
  // Load Markdown Content
  // =======================================


  useEffect(() => {



    if (

      !selectedRepository ||

      !selectedFile

    ) {


      setMarkdown("");

      return;


    }





    const repo = selectedRepository;

    const file = selectedFile;





    async function loadMarkdown() {



      try {



        setMarkdownLoading(true);



        const response = await fetch(

          `/api/github/content?repo=${repo.name}&path=${encodeURIComponent(file)}`

        );



        if (!response.ok) {


          throw new Error(

            "Failed to fetch markdown"

          );


        }



        const data =

          await response.json();




        setMarkdown(

          data.content ?? ""

        );




      } catch(error) {



        console.error(

          "Markdown error:",

          error

        );



        setMarkdown("");




      } finally {



        setMarkdownLoading(false);



      }



    }




    loadMarkdown();



  }, [

    selectedRepository,

    selectedFile,

  ]);







  function handleRepositorySelect(
    repo: Repository
  ) {

    setSelectedRepository(repo);

    setSelectedFile(null);

    setMarkdown("");

    setMobileSidebarOpen(false);

  }






  return (



    <main

      className="
        relative
        flex
        h-screen
        overflow-hidden
        bg-[#f8fafc]
      "

    >




      {/* Mobile Header */}


      <div

        className="
          fixed
          left-0
          right-0
          top-0
          z-30
          flex
          h-14
          items-center
          border-b
          bg-white/90
          px-4
          backdrop-blur
          md:hidden
        "

      >


        <button

          onClick={() =>
            setMobileSidebarOpen(true)
          }

          className="
            rounded-lg
            p-2
            hover:bg-gray-100
          "

        >

          <Menu size={22}/>


        </button>



        <h1

          className="
            ml-3
            text-sm
            font-semibold
            text-gray-700
          "

        >

          Ebook Library

        </h1>


      </div>







      {/* Sidebar */}



      <div

        className={`

          fixed
          inset-y-0
          left-0
          z-40
          transition-transform
          duration-300

          md:static
          md:translate-x-0

          ${
            mobileSidebarOpen

            ? "translate-x-0"

            : "-translate-x-full"

          }

        `}

      >



        <div

          className="
            relative
          "

        >


          <button

            onClick={() =>
              setMobileSidebarOpen(false)
            }

            className="
              absolute
              right-3
              top-3
              z-50
              rounded-lg
              p-2
              hover:bg-gray-100
              md:hidden
            "

          >

            <X size={20}/>


          </button>



          <ExplorerSidebar


            repositories={repositories}


            selectedRepository={
              selectedRepository
            }


            tree={tree}


            treeLoading={treeLoading}


            onRepositorySelect={
              handleRepositorySelect
            }


            onFileSelect={(file)=>{

              setSelectedFile(file);

              setMobileSidebarOpen(false);

            }}


          />


        </div>


      </div>







      {/* Mobile Overlay */}


      {

        mobileSidebarOpen && (

          <div

            onClick={() =>
              setMobileSidebarOpen(false)
            }

            className="
              fixed
              inset-0
              z-30
              bg-black/20
              md:hidden
            "

          />

        )

      }








      {/* Markdown Reader */}



      <section

        className="
          flex-1
          overflow-y-auto
          pt-14
          md:pt-0
        "

      >



        <div

          className="
            mx-auto
            min-h-full
            max-w-5xl
            p-5
            md:p-10
          "

        >



          {!selectedFile && (

            <div

              className="
                flex
                h-full
                items-center
                justify-center
                text-sm
                text-gray-400
              "

            >

              Select a markdown file


            </div>


          )}






          {selectedFile && markdownLoading && (

            <div

              className="
                rounded-xl
                border
                bg-white
                p-6
                text-gray-500
              "

            >

              Loading markdown...


            </div>


          )}






          {selectedFile &&

            !markdownLoading &&

            markdown && (


              <MarkdownReader

                fileName={selectedFile}

                content={markdown}

              />


          )}






          {selectedFile &&

            !markdownLoading &&

            !markdown && (


              <div

                className="
                  rounded-xl
                  border
                  bg-white
                  p-6
                  text-gray-500
                "

              >

                No content found.


              </div>


          )}



        </div>



      </section>




    </main>


  );

}