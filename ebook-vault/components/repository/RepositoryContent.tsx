// ===========================================================
// File: components/repository/RepositoryContent.tsx
// ===========================================================


"use client";


import {
  useEffect,
  useState,
} from "react";



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



interface TreeItem {

  path: string;

  type: "blob" | "tree";

}



interface Props {

  repository: Repository | null;

}





export default function RepositoryContent({

  repository,

}: Props) {



  const [

    files,

    setFiles,

  ] = useState<TreeItem[]>([]);



  const [

    loading,

    setLoading,

  ] = useState(false);





  useEffect(() => {


    if (!repository) {

      setFiles([]);

      return;

    }



    const selectedRepository = repository;



    async function loadRepositoryTree() {


      try {



        setLoading(true);



        const response = await fetch(

          `/api/github/tree?repo=${selectedRepository.name}&branch=${selectedRepository.defaultBranch}`

        );



        if (!response.ok) {


          throw new Error(

            "Failed to load repository tree"

          );


        }



        const data: TreeItem[] =

          await response.json();



        setFiles(data);



      } catch(error) {



        console.error(

          "Repository tree error:",

          error

        );



        setFiles([]);



      } finally {



        setLoading(false);



      }


    }



    loadRepositoryTree();



  }, [repository]);







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





        <div

          className="

            mt-6

            border-t

            pt-5

          "

        >



          <h3

            className="

              mb-4

              text-xl

              font-semibold

            "

          >

            Repository Files


          </h3>





          {loading && (

            <p className="text-gray-500">

              Loading files...

            </p>

          )}







          {!loading && files.length === 0 && (

            <p className="text-gray-500">

              No files found.

            </p>

          )}







          {!loading && files.length > 0 && (

            <div

              className="

                space-y-2

              "

            >



              {files.map((file) => (



                <div

                  key={file.path}

                  className="

                    flex

                    items-center

                    rounded-lg

                    px-3

                    py-2

                    transition

                    hover:bg-gray-50

                  "

                >



                  <span className="mr-3">

                    {file.type === "tree"

                      ? "📁"

                      : "📄"}

                  </span>



                  <span className="text-sm">

                    {file.path}

                  </span>



                </div>



              ))}



            </div>

          )}



        </div>



      </div>



    </section>


  );

}