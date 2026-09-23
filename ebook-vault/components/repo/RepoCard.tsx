// File: components/repo/RepoCard.tsx

"use client";

import {
  Star,
  Code2,
  Calendar,
  ExternalLink,
  BookOpen,
} from "lucide-react";


export interface Repo {

  id: number;

  name: string;

  fullName: string;

  description: string;

  language: string;

  stars: number;

  updatedAt: string;

  url: string;

  defaultBranch: string;

}



interface Props {

  repo: Repo;

  onOpen: (
    repo: Repo
  ) => void;

}



export default function RepoCard({

  repo,

  onOpen,

}: Props) {


  return (

    <div

      className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition
        hover:shadow-lg
      "

    >


      {/* Header */}

      <div

        className="
          flex
          items-start
          justify-between
          gap-3
        "

      >

        <div>

          <h2

            className="
              text-lg
              font-semibold
            "

          >

            {repo.name}

          </h2>


          <p

            className="
              mt-1
              text-sm
              text-gray-500
            "

          >

            {repo.fullName}

          </p>


        </div>



        <a

          href={repo.url}

          target="_blank"

          rel="noopener noreferrer"

          className="
            rounded-lg
            p-2
            hover:bg-gray-100
          "

        >

          <ExternalLink size={18}/>


        </a>


      </div>



      {/* Description */}

      <p

        className="
          mt-4
          min-h-[48px]
          text-sm
          text-gray-600
        "

      >

        {

          repo.description ||

          "No description available."

        }


      </p>




      {/* Metadata */}

      <div

        className="
          mt-5
          flex
          flex-wrap
          gap-4
          text-sm
          text-gray-500
        "

      >


        <span

          className="
            inline-flex
            items-center
            gap-1
          "

        >

          <Code2 size={15}/>

          {

            repo.language ||

            "Unknown"

          }


        </span>




        <span

          className="
            inline-flex
            items-center
            gap-1
          "

        >

          <Star size={15}/>

          {

            repo.stars

          }


        </span>





        <span

          className="
            inline-flex
            items-center
            gap-1
          "

        >

          <Calendar size={15}/>


          {

            repo.updatedAt

              ?

            new Date(
              repo.updatedAt
            ).toLocaleDateString()

              :

            "Unknown"

          }


        </span>


      </div>




      {/* Open Repository */}

      <button

        onClick={() => onOpen(repo)}

        className="
          mt-6
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          py-3
          font-medium
          text-white
          transition
          hover:bg-blue-700
        "

      >

        <BookOpen size={18}/>

        Open Repository


      </button>



    </div>

  );

}