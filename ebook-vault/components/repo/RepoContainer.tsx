"use client";


import { useState } from "react";

import RepoList from "./RepoList";

import type { Repo } from "./RepoCard";


export default function RepoContainer(){


  const [selectedRepo,setSelectedRepo] =

    useState<Repo | null>(null);



  function handleRepoSelect(repo:Repo){


    console.log(

      "Selected repository:",

      repo

    );


    setSelectedRepo(repo);


  }



  return (

    <div>


      <RepoList

        onSelect={handleRepoSelect}

      />



      {

        selectedRepo && (

          <p className="mt-4">

            Selected:

            {" "}

            {selectedRepo.name}

          </p>

        )

      }


    </div>

  );

}