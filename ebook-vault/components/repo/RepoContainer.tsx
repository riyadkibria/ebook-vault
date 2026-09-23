// components/repo/RepoContainer.tsx

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

}: Props) {



  const [
    selectedRepo,
    setSelectedRepo
  ] = useState<Repo | null>(null);




  function handleRepoSelect(

    repo: Repo

  ) {



    console.log(

      "Selected repository:",

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

          <p

            className="
              mt-4
              rounded-lg
              bg-blue-50
              p-3
              text-sm
              text-blue-700
            "

          >

            Selected:

            {" "}

            {selectedRepo.name}


          </p>

        )

      }



    </div>

  );

}