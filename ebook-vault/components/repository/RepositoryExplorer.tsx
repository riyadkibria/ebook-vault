// ===========================================================
// File: components/repository/RepositoryExplorer.tsx
// ===========================================================

"use client";

import {
  useEffect,
  useState,
} from "react";

import RepositorySidebar from "./RepositorySidebar";
import FileTree from "./FileTree";
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
            "Failed to load tree"
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







  return (


    <main

      className="
        flex
        h-screen
        overflow-hidden
        bg-gray-50
      "

    >



      {/* ==================================
          LEFT : Repository + File Tree
      =================================== */}



      <aside

        className="
          flex
          w-80
          shrink-0
          flex-col
          border-r
          bg-white
        "

      >



        {/* Repository Selector */}

        <div

          className="
            border-b
            p-4
          "

        >


          <h2

            className="
              mb-3
              text-lg
              font-bold
            "

          >

            Repositories

          </h2>



          <RepositorySidebar

            repositories={repositories}

            selectedRepository={
              selectedRepository
            }

            onSelect={
              setSelectedRepository
            }

          />


        </div>





        {/* File Tree */}

        <div

          className="
            flex-1
            overflow-y-auto
            p-4
          "

        >



          {!selectedRepository && (

            <p className="text-sm text-gray-400">

              Select repository

            </p>

          )}






          {selectedRepository && (

            <>


              <div

                className="
                  mb-4
                "

              >

                <h3

                  className="
                    font-semibold
                  "

                >

                  {selectedRepository.name}

                </h3>


                <p

                  className="
                    text-xs
                    text-gray-500
                  "

                >

                  {selectedRepository.fullName}

                </p>


              </div>





              {treeLoading && (

                <p className="text-gray-500">

                  Loading files...

                </p>

              )}






              {!treeLoading &&
                tree.length > 0 && (


                <FileTree

                  nodes={tree}

                  onFileSelect={
                    setSelectedFile
                  }

                />


              )}






              {!treeLoading &&
                tree.length === 0 && (


                <p className="text-gray-500">

                  No markdown files.

                </p>


              )}



            </>

          )}



        </div>



      </aside>







      {/* ==================================
          RIGHT : Markdown Reader
      =================================== */}



      <section

        className="
          flex-1
          overflow-y-auto
          bg-white
          p-10
        "

      >



        {!selectedFile && (


          <div

            className="
              flex
              h-full
              items-center
              justify-center
              text-gray-400
            "

          >

            Select a markdown file


          </div>


        )}







        {selectedFile &&
          markdownLoading && (


          <div className="text-gray-500">

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


          <div className="text-gray-500">

            No content found.

          </div>


        )}





      </section>





    </main>


  );

}