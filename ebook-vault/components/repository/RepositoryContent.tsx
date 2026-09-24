// ===========================================================
// File: components/repository/RepositoryContent.tsx
// ===========================================================


"use client";


import {
  useEffect,
  useState,
} from "react";


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

  repository: Repository | null;

}





export default function RepositoryContent({

  repository,

}: Props) {



  const [tree, setTree] = useState<TreeNode[]>([]);



  const [loading, setLoading] = useState(false);



  const [selectedFile, setSelectedFile] =
    useState<string | null>(null);



  const [content, setContent] =
    useState("");



  const [contentLoading, setContentLoading] =
    useState(false);







  // =====================================================
  // Load Repository File Tree
  // =====================================================


  useEffect(() => {



    if (!repository) {

      setTree([]);

      setSelectedFile(null);

      setContent("");

      return;

    }



    const currentRepository = repository;



    async function loadRepositoryTree() {



      try {


        setLoading(true);



        const response = await fetch(

          `/api/github/tree?repo=${currentRepository.name}&branch=${currentRepository.defaultBranch}`

        );




        if (!response.ok) {

          throw new Error(
            "Failed to fetch repository tree"
          );

        }




        const data: GithubTreeItem[] =
          await response.json();




        const structuredTree =
          buildTree(data);



        setTree(structuredTree);



      } catch(error) {



        console.error(
          "Repository tree error:",
          error
        );



        setTree([]);



      } finally {



        setLoading(false);



      }


    }



    loadRepositoryTree();



  }, [repository]);










  // =====================================================
  // Load Selected Markdown File
  // =====================================================


  useEffect(() => {



    if (!selectedFile || !repository) {

      setContent("");

      return;

    }




    const currentRepository = repository;

    const currentFile = selectedFile;





    async function loadFileContent() {



      try {



        setContentLoading(true);




        const response = await fetch(

          `/api/github/content?repo=${currentRepository.name}&path=${encodeURIComponent(currentFile)}`

        );




        if (!response.ok) {

          throw new Error(
            "Failed to fetch markdown content"
          );

        }




        const data = await response.json();




        setContent(
          data.content ?? ""
        );





      } catch(error) {



        console.error(
          "Markdown content error:",
          error
        );



        setContent("");




      } finally {



        setContentLoading(false);



      }


    }





    loadFileContent();





  }, [

    selectedFile,

    repository,

  ]);









  if (!repository) {



    return (


      <section

        className="
          flex
          flex-1
          items-center
          justify-center
          text-gray-400
        "

      >

        Select a repository


      </section>


    );


  }









  return (



    <section

      className="
        flex-1
        overflow-y-auto
        p-8
      "

    >




      <div

        className="
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
        "

      >




        {/* Repository Header */}


        <h2

          className="
            text-3xl
            font-bold
          "

        >

          {repository.name}


        </h2>





        <p

          className="
            mt-2
            text-sm
            text-gray-500
          "

        >

          {repository.fullName}


        </p>





        <p

          className="
            mt-5
            text-gray-700
          "

        >

          {
            repository.description ??
            "No description provided."
          }


        </p>









        {/* File Explorer */}



        <div

          className="
            mt-8
            border-t
            pt-6
          "

        >




          <h3

            className="
              mb-4
              text-xl
              font-semibold
            "

          >

            Repository Explorer


          </h3>






          {
            loading && (

              <p className="text-gray-500">

                Loading files...

              </p>


            )
          }







          {
            !loading &&
            tree.length === 0 && (

              <p className="text-gray-500">

                No markdown files found.

              </p>


            )
          }







          {
            !loading &&
            tree.length > 0 && (


              <FileTree

                nodes={tree}

                onFileSelect={
                  setSelectedFile
                }

              />


            )
          }





        </div>









        {/* Markdown Reader */}




        {
          selectedFile && (


            <div

              className="
                mt-8
              "

            >




              {
                contentLoading && (


                  <div

                    className="
                      rounded-xl
                      border
                      bg-gray-50
                      p-6
                      text-gray-500
                    "

                  >

                    Loading markdown...


                  </div>


                )

              }








              {
                !contentLoading &&
                content && (


                  <MarkdownReader

                    content={content}

                    fileName={selectedFile}

                  />


                )
              }








              {
                !contentLoading &&
                !content && (


                  <div

                    className="
                      rounded-xl
                      border
                      bg-gray-50
                      p-6
                      text-gray-500
                    "

                  >

                    No content found.


                  </div>


                )

              }







            </div>


          )

        }








      </div>





    </section>



  );

}