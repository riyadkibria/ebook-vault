"use client";

import {
  useState,
} from "react";


import RepositorySidebar from "./RepositorySidebar";

import RepositoryContent from "./RepositoryContent";



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



  function handleRepositorySelect(
    repository: Repository
  ) {

    console.log(
      "Selected Repository:",
      repository
    );


    setSelectedRepository(
      repository
    );

  }



  return (

    <main
      className="
        flex
        min-h-screen
        bg-gray-50
      "
    >


      <RepositorySidebar

        repositories={
          repositories
        }

        selectedRepository={
          selectedRepository
        }

        onSelect={
          handleRepositorySelect
        }

      />



      <RepositoryContent

        repository={
          selectedRepository
        }

      />


    </main>

  );

}