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

}



export default function RepoContainer({

  repos

}:Props){



  const [

    selectedRepo,

    setSelectedRepo

  ] = useState<Repo | null>(null);




  function handleRepoSelect(

    repo:Repo

  ){


    console.log(

      "Selected:",

      repo

    );


    setSelectedRepo(repo);


  }




  return (

    <div>


      <RepoList

        repos={repos}

        onSelect={handleRepoSelect}

      />



      {

        selectedRepo && (

          <div

            className="
              mt-4
              rounded-lg
              bg-blue-50
              p-3
            "

          >

            Selected:

            {" "}

            {selectedRepo.name}


          </div>

        )

      }


    </div>

  );

}