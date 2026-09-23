// File: components/repo/RepoContainer.tsx

"use client";


import {
  useState
} from "react";


import RepoList from "./RepoList";


import type {
  Repo
} from "./RepoCard";



interface Props {

  repos: Repo[];

  onTreeLoad: (

    files:any[]

  ) => void;

}




export default function RepoContainer({

  repos,

  onTreeLoad

}: Props){



  const [

    selectedRepo,

    setSelectedRepo

  ] = useState<Repo | null>(null);



  const [

    loading,

    setLoading

  ] = useState(false);





  async function handleRepoSelect(

    repo:Repo

  ){


    setSelectedRepo(repo);



    try {


      setLoading(true);



      const response =

        await fetch(

          `/api/github/tree?repo=${encodeURIComponent(repo.name)}`,

          {

            cache:"no-store"

          }

        );



      if(!response.ok){


        throw new Error(

          "Failed to load repository tree"

        );


      }





      const files =

        await response.json();





      if(!Array.isArray(files)){


        throw new Error(

          "Invalid repository response"

        );


      }





      onTreeLoad(files);




    } catch(error){


      console.error(

        "Repository loading error:",

        error

      );



    } finally {


      setLoading(false);


    }


  }





  return (

    <div>


      <RepoList

        repos={repos}

        onSelect={handleRepoSelect}

      />




      {selectedRepo && (

        <div

          className="

            mt-4

            rounded-lg

            bg-blue-50

            p-3

            text-sm

            text-blue-700

          "

        >

          {loading ? (

            "Loading repository..."

          ) : (

            <>

              Selected repository:

              {" "}

              <strong>

                {selectedRepo.name}

              </strong>

            </>

          )}

        </div>

      )}



    </div>

  );

}