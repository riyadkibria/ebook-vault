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
  BookOpen,
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
        bg-gradient-to-br
        from-slate-50
        via-white
        to-slate-50
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
          gap-3
          border-b
          border-slate-200/70
          bg-white/80
          px-4
          shadow-sm
          backdrop-blur-md
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
            text-slate-600
            transition-colors
            duration-150
            hover:bg-slate-100
            hover:text-slate-900
          "

        >

          <Menu size={20}/>


        </button>



        <div

          className="
            flex
            items-center
            gap-2
          "

        >

          <div

            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-md
              bg-gradient-to-br
              from-slate-800
              to-slate-600
            "

          >

            <BookOpen
              size={12}
              className="text-white"
            />

          </div>

          <h1

            className="
              text-sm
              font-semibold
              tracking-tight
              text-slate-800
            "

          >

            Ebook Library

          </h1>

        </div>


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
          ease-in-out

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
            h-full
            shadow-2xl
            shadow-slate-900/10
            md:shadow-none
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
              border
              border-slate-200
              bg-white
              p-1.5
              text-slate-500
              shadow-sm
              transition-colors
              duration-150
              hover:bg-slate-100
              hover:text-slate-900
              md:hidden
            "

          >

            <X size={18}/>


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
              bg-slate-900/20
              backdrop-blur-[2px]
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
                flex-col
                items-center
                justify-center
                gap-3
                text-center
              "

            >

              <div

                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  shadow-sm
                  ring-1
                  ring-slate-200/70
                "

              >

                <BookOpen
                  size={20}
                  className="text-slate-300"
                />

              </div>

              <p

                className="
                  text-sm
                  font-medium
                  text-slate-400
                "

              >

                Select a markdown file

              </p>


            </div>


          )}






          {selectedFile && markdownLoading && (

            <div

              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200/70
                bg-white
                p-6
                text-sm
                font-medium
                text-slate-500
                shadow-sm
              "

            >

              <span

                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-300
                  border-t-slate-700
                "

              />

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
                  rounded-2xl
                  border
                  border-slate-200/70
                  bg-white
                  p-6
                  text-sm
                  font-medium
                  text-slate-400
                  shadow-sm
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