"use client";


import RepoCard, {

  type Repo

} from "./RepoCard";



interface Props {


  repos: Repo[];


  onSelect:(

    repo:Repo

  )=>void;


}



export default function RepoList({

  repos,

  onSelect,

}:Props){



  if(repos.length === 0){


    return (

      <div

        className="
          rounded-xl
          border
          bg-gray-50
          p-8
          text-center
          text-gray-500
        "

      >

        No repositories found.


      </div>

    );


  }




  return (

    <div

      className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
      "

    >


      {

        repos.map((repo)=>(


          <RepoCard

            key={repo.id}

            repo={repo}

            onOpen={onSelect}

          />


        ))

      }


    </div>

  );


}